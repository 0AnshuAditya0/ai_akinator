import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-r1:free';

// In-memory rate limiter (resets on cold start, acceptable for free tier)
const rateLimits = new Map();

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    
    // Rate limiting: 1 req/sec per IP
    const lastRequest = rateLimits.get(ip);
    if (lastRequest && now - lastRequest < 1000) {
      return NextResponse.json({ error: 'Rate limited. Slow down.' }, { status: 429 });
    }
    rateLimits.set(ip, now);
    
    const body = await request.json();
    const { session_id, answer, question } = body;
    
    // Validate answer
    if (!['Yes', 'No', 'Maybe', 'Unknown'].includes(answer)) {
      return NextResponse.json({ error: 'Invalid answer' }, { status: 400 });
    }
    
    // Fetch session
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', session_id)
      .single();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    // Update history
    const history = session.history || [];
    history.push({
      question: question || session.last_question || 'Is your player Indian?',
      answer,
      timestamp: new Date().toISOString()
    });
    
    // Parse candidate pool
    let candidates = session.candidate_pool || [];
    
    // Filter: remove < 1% probability
    candidates = candidates.filter(c => (c.probability || 0) >= 1);
    if (candidates.length < 2) {
      candidates = session.candidate_pool; // fallback
    }
    
    // Sort by probability desc
    candidates.sort((a, b) => (b.probability || 0) - (a.probability || 0));
    
    // Top 40 only for LLM
    const topCandidates = candidates.slice(0, 40);
    
    // Call DeepSeek R1
    let result;
    let fallbackUsed = false;
    
    try {
      result = await callDeepSeek(topCandidates, history, session.question_count);
    } catch (error) {
      console.error('[ERR] DeepSeek failed:', error);
      
      // Log error
      await supabase.from('error_log').insert({
        session_id,
        error_type: 'llm_failure',
        error_message: error instanceof Error ? error.message : 'Unknown',
        fallback_used: true
      });
      
      // Fallback to local scorer
      result = localScorer(candidates, history);
      fallbackUsed = true;
    }
    
    // Merge new probabilities
    let newPool = candidates;
    if (result.probabilities) {
        newPool = candidates.map(c => {
            const found = result.probabilities.find(p => p.name === c.name);
            return { ...c, probability: found ? found.probability : (c.probability * 0.1) };
        }).sort((a,b) => b.probability - a.probability);
    }

    // Update session
    const { error: updateError } = await supabase
      .from('sessions')
      .update({
        candidate_pool: newPool,
        history,
        question_count: session.question_count + 1,
        last_guessed_player: result.confidence >= 80 ? result.topPlayer : session.last_guessed_player,
        status: result.confidence >= 80 ? 'guessed' : 'active',
        last_question: result.next_question,
        updated_at: new Date().toISOString()
      })
      .eq('id', session_id);
    
    if (updateError) {
      return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
    }
    
    const isGuess = result.confidence >= 80 || session.question_count >= 7 || result.next_question.startsWith("GUESS:");
    let finalNextQ = result.next_question;
    let guessedPlayer = result.topPlayer;

    if (finalNextQ.startsWith("GUESS:")) {
      guessedPlayer = finalNextQ.replace("GUESS:", "").trim();
    }

    return NextResponse.json({
      type: isGuess ? 'guess' : 'question',
      question: isGuess ? null : finalNextQ,
      guessed_player: isGuess ? guessedPlayer : null,
      confidence: result.confidence,
      top_candidates: newPool.slice(0, 5).map(c => ({ name: c.name, probability: c.probability })),
      question_count: session.question_count + 1,
      session_id,
      fallback_used: fallbackUsed
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function callDeepSeek(candidates, history, questionCount) {
  const prompt = `You are an IPL Strategist AI. Think step-by-step.

CANDIDATES (${candidates.length} players):
${JSON.stringify(candidates.map(c => ({ name: c.name, probability: c.probability, role: c.role, nationality: c.nationality, is_overseas: c.is_overseas, teams: c.teams, era: c.era })), null, 2)}

QUESTION HISTORY:
${JSON.stringify(history, null, 2)}

TASK:
1. Calculate updated probability (0-100) for each candidate:
   - "Yes": Multiply matching attributes by 2.0
   - "No": Divide non-matching attributes by 3.0  
   - "Maybe/Unknown": Multiply by 0.5 (don't eliminate)
2. Normalize so probabilities sum to 100
3. Pick the best next question (max information gain, splits pool ~50/50)
4. Calculate confidence = highest probability / sum * 100

OUTPUT STRICT JSON:
{
  "probabilities": [{"name": "Player", "probability": 45.2}],
  "next_question": "Is your player...?",
  "confidence": 45.2,
  "topPlayer": "Highest probability player name"
}

RULES:
- If confidence >= 80 OR question_count >= 8: next_question = "GUESS: [topPlayer]"
- Never repeat questions from history
- Never ask about confirmed attributes`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.2,
      max_tokens: 2000
    })
  });
  
  if (!response.ok) {
    throw new Error(`OpenRouter error: ${response.status}`);
  }
  
  const data = await response.json();
  const content = data.choices[0].message.content;
  
  // Extract JSON from markdown or raw text
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                    content.match(/\{[\s\S]*\}/);
  
  if (!jsonMatch) {
    throw new Error('No JSON found in response');
  }
  
  return JSON.parse(jsonMatch[1] || jsonMatch[0]);
}

function localScorer(candidates, history) {
  // Simple weighted scoring when LLM fails
  const scored = candidates.map(c => {
    let score = c.probability || 10;
    
    history.forEach(h => {
      const q = h.question.toLowerCase();
      const a = h.answer;
      
      // Attribute matching logic
      if (q.includes('indian') && a === 'Yes' && c.nationality === 'Indian') score *= 2;
      if (q.includes('indian') && a === 'No' && c.nationality !== 'Indian') score *= 2;
      if (q.includes('overseas') && a === 'Yes' && c.is_overseas) score *= 2;
      if (q.includes('batsman') && a === 'Yes' && c.role === 'Batsman') score *= 2;
      if (q.includes('bowler') && a === 'Yes' && c.role === 'Bowler') score *= 2;
      if (q.includes('captain') && a === 'Yes' && c.has_captained) score *= 2;
      if (q.includes('wicketkeeper') && a === 'Yes' && c.role === 'Wicketkeeper') score *= 2;
      if (q.includes('finisher') && a === 'Yes' && c.is_finisher) score *= 2;
      
      // Penalize mismatches
      if (q.includes('indian') && a === 'Yes' && c.nationality !== 'Indian') score /= 3;
      if (q.includes('batsman') && a === 'Yes' && c.role !== 'Batsman') score /= 3;
    });
    
    return { ...c, probability: Math.max(0.1, score) };
  });
  
  // Normalize
  const total = scored.reduce((sum, c) => sum + c.probability, 0);
  const normalized = scored.map(c => ({ ...c, probability: (c.probability / total * 100) }));
  normalized.sort((a, b) => b.probability - a.probability);
  
  // Pick next question from bank
  const questionBank = [
    'Is your player Indian?',
    'Is your player primarily a batsman?',
    'Is your player a bowler?',
    'Has your player captained an IPL team?',
    'Is your player known for finishing matches?',
    'Does your player bowl spin?',
    'Is your player an overseas player?',
    'Has your player won the IPL trophy?',
    'Is your player a wicketkeeper?',
    'Does your player bowl in the death overs?'
  ];
  
  const usedQuestions = history.map(h => h.question);
  const availableQuestions = questionBank.filter(q => !usedQuestions.includes(q));
  
  return {
    probabilities: normalized,
    next_question: availableQuestions[0] || 'Is your player from the modern era (2018+)?',
    confidence: normalized[0]?.probability || 0,
    topPlayer: normalized[0]?.name
  };
}
