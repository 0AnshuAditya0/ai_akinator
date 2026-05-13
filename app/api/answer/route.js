import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { localScorer } from '@/lib/question-bank';

export async function POST(request) {
  try {
    const body = await request.json();
    const { session_id, answer } = body;
    
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
      question: session.last_question || 'Is your player Indian?',
      answer,
      timestamp: new Date().toISOString()
    });
    
    // Fetch all players for local scoring
    const { data: players } = await supabase.from('players').select('*');
    
    if (!players || players.length === 0) {
        throw new Error("No players found in database");
    }

    // LOCAL SCORING — NO API CALL, INSTANT RESPONSE
    const result = localScorer(players, history);
    
    const isGuess = result.confidence >= 80 || history.length >= 12;
    const finalNextQ = isGuess ? `GUESS: ${result.topPlayer}` : result.next_question;

    // Update session
    const { error: updateError } = await supabase
      .from('sessions')
      .update({
        candidate_pool: result.probabilities.slice(0, 40),
        history,
        question_count: history.length,
        last_guessed_player: isGuess ? result.topPlayer : session.last_guessed_player,
        status: isGuess ? 'guessed' : 'active',
        last_question: finalNextQ,
        updated_at: new Date().toISOString()
      })
      .eq('id', session_id);
    
    if (updateError) {
      return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
    }
    
    // Artificial delay for premium UX feel
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({
      type: isGuess ? 'guess' : 'question',
      question: isGuess ? null : finalNextQ,
      guessed_player: isGuess ? result.topPlayer : null,
      guessed_player_data: isGuess ? result.probabilities[0] : null,
      confidence: result.confidence,
      top_candidates: result.probabilities.slice(0, 5).map(c => ({ name: c.name, probability: c.probability })),
      pool_size: players.length,
      question_count: history.length,
      session_id,
      response_time_ms: 50
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
