import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { localScorer } from '@/lib/scorer';
import { pickBestQuestion } from '@/lib/questions';

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-r1:free';

const rateLimits = new Map();

const delay = ms => new Promise(res => setTimeout(res, ms));

async function callDeepSeekWithRetry(candidates, history, maxRetries = 2) {
  const prompt = `
You are an IPL Strategist AI. Think step-by-step before outputting JSON.

TASK:
1. REVIEW the question history and the Top 40 candidate players.
2. CALCULATE updated probability (0-100) for each candidate:
   - "Yes": Strongly support matching attributes (multiply by 2.0)
   - "No": Strongly eliminate non-matching attributes (divide by 3.0)
   - "Maybe" / "Unknown": Slightly reduce (multiply by 0.5). Do NOT eliminate.
3. NORMALIZE all probabilities so they sum to 100.
4. IDENTIFY the single best next question that splits the pool 50/50.
5. CALCULATE confidence = highest probability.

RULES:
- If confidence >= 80 OR history.length >= 8: set next_question to "GUESS: [Player Name]".
- NEVER repeat a question.
- NEVER ask about an already confirmed attribute.
- If only 1 candidate remains, you MUST output "GUESS: [that player]".

CANDIDATES (Top 40):
${JSON.stringify(candidates.map(c => ({ name: c.name, nationality: c.nationality, role: c.role, teams: c.teams, probability: c.probability })))}

HISTORY:
${JSON.stringify(history)}

OUTPUT STRICT JSON ONLY:
{
  "probabilities": {"Player Name": 45.2},
  "next_question": "...",
  "confidence": 45.2,
  "reasoning": "..."
}
`;

  let lastError;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) throw new Error(`API Error ${response.status}`);
      const data = await response.json();
      const text = data.choices[0].message.content;
      
      const match = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[1] || match[0]);
      return JSON.parse(text);
    } catch (e) {
      lastError = e;
      if (i < maxRetries) await delay(1000 * (i + 1));
    }
  }
  throw lastError;
}

export async function POST(req) {
  try {
    const { session_id, question, answer } = await req.json();
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    const now = Date.now();
    if (rateLimits.has(ip) && now - rateLimits.get(ip) < 1000) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }
    rateLimits.set(ip, now);

    if (!['Yes', 'No', 'Maybe', 'Unknown'].includes(answer)) {
      return NextResponse.json({ error: 'Invalid answer' }, { status: 400 });
    }

    const { data: session, error: sessionErr } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', session_id)
      .single();

    if (sessionErr || !session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    const newHistory = [...session.history, { question, answer }];
    let candidates = session.candidate_pool;

    // Filter < 1%
    candidates = candidates.filter(c => c.probability >= 1.0);
    if (candidates.length < 2) {
      candidates = session.candidate_pool; // restore if we went too low
    }
    
    // Top 40
    candidates = candidates.sort((a,b) => b.probability - a.probability).slice(0, 40);

    let fallbackUsed = false;
    let nextQ = "";
    let confidence = 0;
    let isGuess = false;
    let guessedPlayer = "";

    try {
      const aiResult = await callDeepSeekWithRetry(candidates, newHistory);
      
      // Update probabilities from AI
      if (aiResult.probabilities) {
        candidates = candidates.map(c => ({
          ...c,
          probability: aiResult.probabilities[c.name] || (c.probability * 0.1)
        })).sort((a,b) => b.probability - a.probability);
      }

      nextQ = aiResult.next_question;
      confidence = aiResult.confidence;
    } catch (e) {
      console.warn("AI Failed, using local fallback", e);
      fallbackUsed = true;
      candidates = localScorer(candidates, newHistory);
      
      confidence = candidates[0].probability;
      if (confidence >= 80 || newHistory.length >= 12 || candidates.length === 1) {
        nextQ = "GUESS: " + candidates[0].name;
      } else {
        nextQ = pickBestQuestion(candidates, newHistory.map(h => h.question));
        if (!nextQ) nextQ = "GUESS: " + candidates[0].name; // out of questions
      }

      // Log error (fire and forget)
      supabase.from('error_log').insert({
        session_id,
        error_type: 'AI_FALLBACK',
        error_message: e.message,
        fallback_used: true
      }).then();
    }

    if (nextQ.startsWith("GUESS:")) {
      isGuess = true;
      guessedPlayer = nextQ.replace("GUESS:", "").trim();
    }

    // Save updated session
    await supabase.from('sessions').update({
      candidate_pool: candidates,
      history: newHistory,
      question_count: session.question_count + 1,
      last_guessed_player: guessedPlayer || session.last_guessed_player
    }).eq('id', session_id);

    return NextResponse.json({
      type: isGuess ? 'guess' : 'question',
      question: isGuess ? null : nextQ,
      guessed_player: isGuess ? guessedPlayer : null,
      confidence,
      top_candidates: candidates.slice(0, 5).map(c => ({ name: c.name, probability: c.probability })),
      question_count: session.question_count + 1,
      session_id,
      fallback_used: fallbackUsed
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
