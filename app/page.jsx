'use client';
import { useState, useEffect } from 'react';
import DiagnosticsSidebar from '@/components/DiagnosticsSidebar';
import VibrantPitchStage from '@/components/VibrantPitchStage';
import GuessReveal from '@/components/GuessReveal';

export default function Game() {
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState('Initializing Logic Engine...');
  const [history, setHistory] = useState([]);
  const [topCandidates, setTopCandidates] = useState([]);
  const [poolSize, setPoolSize] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [guessState, setGuessState] = useState({ isOpen: false, player: null });

  const startGame = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/start', { method: 'POST' });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setSessionId(data.session_id);
      setQuestion(data.question);
      setTopCandidates(data.top_candidates || []);
      setPoolSize(data.pool_size || 91);
      setConfidence(data.confidence || 0);
      setHistory([]);
      setIsCompleted(false);
      setGuessState({ isOpen: false, player: null });
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    startGame();
  }, []);

  const handleAnswer = async (answer) => {
    if (isLoading || guessState.isOpen || isCompleted) return;
    
    const currentQuestion = question;
    setHistory(prev => [...prev, { question: currentQuestion, answer }]);
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, question: currentQuestion, answer })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setTopCandidates(data.top_candidates || []);
      setConfidence(data.confidence || 0);
      setPoolSize(data.pool_size || 0);

      if (data.type === 'guess') {
        setGuessState({ isOpen: true, player: data.guessed_player_data || { name: data.guessed_player } });
      } else {
        setQuestion(data.question);
      }

    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleFeedback = async (isCorrect) => {
    setGuessState(prev => ({ ...prev, isOpen: false }));
    setIsLoading(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, was_correct: isCorrect })
      });
      const data = await res.json();
      
      if (isCorrect) {
        setIsCompleted(true);
      } else {
        if (data.type === 'guess') {
            setGuessState({ isOpen: true, player: data.guessed_player_data || { name: data.guessed_player } });
        } else {
            setQuestion(data.question);
            setTopCandidates(data.top_candidates || []);
            setConfidence(data.confidence || 0);
            setPoolSize(data.pool_size || 0);
        }
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-[#050B18] text-white font-sans overflow-hidden">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-[100] p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/10"
      >
        <div className="w-6 h-0.5 bg-white mb-1"></div>
        <div className="w-6 h-0.5 bg-white mb-1"></div>
        <div className="w-6 h-0.5 bg-white"></div>
      </button>

      {/* Sidebar - Machine Diagnostics */}
      <div className={`
        fixed inset-0 z-50 lg:relative lg:block
        ${isSidebarOpen ? 'block' : 'hidden'}
      `}>
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
        <DiagnosticsSidebar 
          history={history} 
          poolSize={poolSize} 
          topCandidates={topCandidates}
        />
      </div>
      
      <div className="flex-1 flex flex-col relative h-full">
        {isCompleted ? (
          <div className="h-full relative overflow-hidden flex flex-col items-center justify-center p-12">
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: `url('/vibrant.png')` }}
            />
            <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-md" />
            
            <div className="relative z-20 text-center space-y-8">
              <h2 className="text-5xl md:text-7xl font-serif text-white italic drop-shadow-2xl">Identity Confirmed</h2>
              <button 
                onClick={startGame} 
                className="px-12 py-4 bg-[#C4A484] text-white font-bold tracking-[0.3em] uppercase hover:bg-[#A6896A] transition-all rounded-full shadow-2xl"
              >
                Start New Diagnostics
              </button>
            </div>
          </div>
        ) : (
          <VibrantPitchStage 
            question={question} 
            questionCount={history.length} 
            onAnswer={handleAnswer} 
            isThinking={isLoading} 
          />
        )}
      </div>

      <GuessReveal 
        isOpen={guessState.isOpen} 
        player={guessState.player} 
        onFeedback={handleFeedback} 
        isCorrect={isCompleted}
      />
    </div>
  );
}
