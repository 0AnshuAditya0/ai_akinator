import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { pickBestQuestion } from '@/lib/questions';

export async function POST(req) {
  try {
    const { session_id, was_correct, actual_player } = await req.json();

    const { data: session, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', session_id)
      .single();

    if (error || !session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    if (was_correct) {
      await supabase.from('sessions').update({ status: 'completed' }).eq('id', session_id);
      return NextResponse.json({ success: true, message: 'Correct!' });
    }

    // Was wrong - eliminate the guessed player
    let candidates = session.candidate_pool;
    const guessedPlayerName = session.last_guessed_player;

    candidates = candidates.map(c => {
      if (c.name === guessedPlayerName) return { ...c, probability: 0 };
      return c;
    });

    // Renormalize
    const totalProb = candidates.reduce((s, c) => s + c.probability, 0);
    candidates = candidates.map(c => ({
      ...c,
      probability: totalProb > 0 ? (c.probability / totalProb) * 100 : 0
    })).sort((a,b) => b.probability - a.probability);

    const remaining = candidates.filter(c => c.probability > 0);

    let nextQ = "";
    let isGuess = false;
    let newGuessedPlayer = "";

    if (remaining.length === 1 || session.question_count >= 12) {
      isGuess = true;
      newGuessedPlayer = remaining[0].name;
    } else {
      nextQ = pickBestQuestion(remaining, session.history.map(h => h.question));
      if (!nextQ) {
        isGuess = true;
        newGuessedPlayer = remaining[0].name;
      }
    }

    await supabase.from('sessions').update({
      candidate_pool: candidates,
      status: 'active',
      last_guessed_player: isGuess ? newGuessedPlayer : session.last_guessed_player
    }).eq('id', session_id);

    return NextResponse.json({
      type: isGuess ? 'guess' : 'question',
      question: isGuess ? null : nextQ,
      guessed_player: isGuess ? newGuessedPlayer : null,
      confidence: remaining[0].probability,
      top_candidates: remaining.slice(0, 5).map(c => ({ name: c.name, probability: c.probability })),
      question_count: session.question_count,
      session_id,
      fallback_used: true // Since we bypassed AI for the retry question calculation for speed
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
