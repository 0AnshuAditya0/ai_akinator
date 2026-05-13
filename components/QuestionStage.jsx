'use client';
import { useEffect } from 'react';

export default function QuestionStage({ question, onAnswer, disabled }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (disabled) return;
      const key = e.key.toLowerCase();
      if (key === 'y') onAnswer('Yes');
      if (key === 'n') onAnswer('No');
      if (key === 'm') onAnswer('Maybe');
      if (key === 'u' || key === '?') onAnswer('Unknown');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, onAnswer]);

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 flex flex-col items-center pointer-events-none">
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-8 rounded-2xl w-full flex flex-col items-center pointer-events-auto shadow-2xl">
        <div className="text-center space-y-4 mb-8">
          <div className="text-[10px] font-mono text-cyan uppercase tracking-[0.5em] opacity-70">
            PROBABILITY SELECTION
          </div>
          <h1 className="text-xl md:text-2xl font-light text-white leading-tight">
            {question}
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <button
            onClick={() => onAnswer('Yes')}
            disabled={disabled}
            className="group relative px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-green-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-white text-sm font-bold uppercase tracking-widest group-hover:text-green-400 transition-colors">Yes</div>
            <div className="text-[10px] text-gray-500 font-mono mt-1 group-hover:text-green-400/70">PRESS [Y]</div>
          </button>
          
          <button
            onClick={() => onAnswer('No')}
            disabled={disabled}
            className="group relative px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-red-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-white text-sm font-bold uppercase tracking-widest group-hover:text-red-400 transition-colors">No</div>
            <div className="text-[10px] text-gray-500 font-mono mt-1 group-hover:text-red-400/70">PRESS [N]</div>
          </button>
          
          <button
            onClick={() => onAnswer('Maybe')}
            disabled={disabled}
            className="group relative px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-yellow-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-white text-sm font-bold uppercase tracking-widest group-hover:text-yellow-400 transition-colors">Maybe</div>
            <div className="text-[10px] text-gray-500 font-mono mt-1 group-hover:text-yellow-400/70">PRESS [M]</div>
          </button>
          
          <button
            onClick={() => onAnswer('Unknown')}
            disabled={disabled}
            className="group relative px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-blue-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-white text-sm font-bold uppercase tracking-widest group-hover:text-blue-400 transition-colors">Unknown</div>
            <div className="text-[10px] text-gray-500 font-mono mt-1 group-hover:text-blue-400/70">PRESS [U]</div>
          </button>
        </div>
      </div>
    </div>
  );
}
