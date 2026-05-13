import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { initDb } from '@/lib/init-db';
import { v4 as uuidv4 } from 'uuid';
import { pickBestQuestion } from '@/lib/questions';

export async function POST(req) {
  try {
    // Ensure DB is seeded
    await initDb();

    // Fetch all players
    const { data: players, error } = await supabase.from('players').select('*');
    if (error) throw error;

    const candidatePool = players.map(p => ({
      ...p,
      probability: 100 / players.length
    }));

    const firstQuestion = pickBestQuestion(candidatePool, []);
    const sessionId = uuidv4();

    // Create session
    const { error: sessionError } = await supabase.from('sessions').insert({
      id: sessionId,
      candidate_pool: candidatePool,
      history: [],
      question_count: 0,
      status: 'active',
      last_question: firstQuestion
    });

    if (sessionError) throw sessionError;

    return NextResponse.json({
      session_id: sessionId,
      question: firstQuestion,
      type: 'question',
      question_count: 0,
      confidence: 100 / players.length,
      top_candidates: candidatePool.slice(0, 5).map(c => ({ name: c.name, probability: c.probability }))
    });
  } catch (err) {
    console.error('Failed to start session:', err);
    return NextResponse.json({ error: 'Failed to start session' }, { status: 500 });
  }
}
