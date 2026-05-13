'use client';
import { useState, useEffect } from 'react';
import SystemLog from '@/components/SystemLog';
import QuestionStage from '@/components/QuestionStage';
import CandidatePool from '@/components/CandidatePool';
import GuessReveal from '@/components/GuessReveal';
import ProgressBar from '@/components/ProgressBar';

export default function Game() {
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState('Initializing Neural Engine...');
  const [topCandidates, setTopCandidates] = useState([]);
  const [logs, setLogs] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [guessState, setGuessState] = useState({ isOpen: false, player: null });
  const [isCompleted, setIsCompleted] = useState(false);

  const addLog = (tag, message) => {
    setLogs(prev => [...prev, { id: Date.now() + Math.random(), time: new Date().toLocaleTimeString('en-GB', { hour12: false }), tag, message }]);
  };

  const startGame = async () => {
    setIsLoading(true);
    addLog('INIT', 'Booting IPL Selector Engine v1.0...');
    addLog('INF', 'Connecting to Supabase core...');
    try {
      const res = await fetch('/api/start', { method: 'POST' });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setSessionId(data.session_id);
      setQuestion(data.question);
      setTopCandidates(data.top_candidates || []);
      setQuestionCount(0);
      setGuessState({ isOpen: false, player: null });
      setIsCompleted(false);
      setLogs([]); // Reset logs optionally or keep them
      addLog('INF', `Session established: ${data.session_id.substring(0, 8)}`);
      addLog('INF', `Pool initialized. Ready for input.`);
    } catch (err) {
      addLog('ERR', 'Failed to initialize session. ' + err.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    startGame();
  }, []);

  const handleAnswer = async (answer) => {
    if (isLoading || guessState.isOpen || isCompleted) return;
    setIsLoading(true);
    addLog('USR', `Input: ${answer}`);
    
    try {
      const res = await fetch('/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, question, answer })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      if (data.fallback_used) addLog('FLL', 'DeepSeek unavailable. Local heuristic active.');
      addLog('INF', `Weights updated. Confidence: ${data.confidence?.toFixed(1)}%`);

      setTopCandidates(data.top_candidates || []);
      setQuestionCount(data.question_count);

      if (data.type === 'guess') {
        setGuessState({ isOpen: true, player: data.guessed_player });
        addLog('INF', `Threshold reached. Executing guess: ${data.guessed_player}`);
      } else {
        setQuestion(data.question);
      }

    } catch (err) {
      addLog('ERR', err.message);
    }
    setIsLoading(false);
  };

  const handleFeedback = async (isCorrect) => {
    setGuessState(prev => ({ ...prev, isOpen: false }));
    setIsLoading(true);
    addLog('USR', isCorrect ? 'Feedback: Correct' : 'Feedback: Incorrect');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, was_correct: isCorrect })
      });
      const data = await res.json();
      
      if (isCorrect) {
        setIsCompleted(true);
        addLog('INF', 'Target successfully identified. Session closed.');
      } else {
        addLog('INF', 'Recalculating vectors...');
        if (data.type === 'guess') {
            setGuessState({ isOpen: true, player: data.guessed_player });
        } else {
            setQuestion(data.question);
            setTopCandidates(data.top_candidates || []);
            setQuestionCount(data.question_count);
        }
      }
    } catch (err) {
      addLog('ERR', err.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen w-full bg-bg text-text-primary overflow-hidden relative">
      <div className="scanline-overlay" />
      
      <SystemLog logs={logs} isOpen={isLogOpen} toggleOpen={() => setIsLogOpen(!isLogOpen)} />
      
      <div className="flex-1 flex flex-col h-full overflow-y-auto relative">
        <button 
          onClick={() => setIsLogOpen(!isLogOpen)}
          className="lg:hidden absolute top-4 left-4 z-40 bg-surface border border-cyan text-cyan font-mono px-3 py-1 text-xs hover:bg-cyan hover:text-black"
        >
          [LOG]
        </button>

        <ProgressBar current={questionCount} total={12} />
        
        <div className="flex-1 flex flex-col items-center p-4 lg:p-8">
          {isCompleted ? (
            <div className="m-auto text-center space-y-6">
              <h2 className="text-4xl font-mono text-green-term mb-4">MATCH CONFIRMED</h2>
              <button onClick={startGame} className="answer-btn border-cyan text-cyan">
                [ INITIALIZE NEW SESSION ]
              </button>
            </div>
          ) : (
            <>
              <QuestionStage 
                question={question} 
                onAnswer={handleAnswer} 
                disabled={isLoading} 
              />
              <CandidatePool candidates={topCandidates} />
            </>
          )}
        </div>
      </div>

      <GuessReveal 
        isOpen={guessState.isOpen} 
        player={guessState.player} 
        onFeedback={handleFeedback} 
      />
    </div>
  );
}
