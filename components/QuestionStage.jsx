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

  const highlightKeyword = (text) => {
    if (!text) return '';
    // Basic heuristic: wrap words like "spin", "Indian", etc., or just render normal if complex
    const keywords = ['spin', 'Indian', 'death', 'finisher', 'opener', 'CSK', 'MI', 'RCB', 'KKR'];
    let result = text;
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      result = result.replace(regex, `<span class="text-cyan font-bold text-glow-cyan">$&</span>`);
    });
    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-12 my-12 w-full px-4">
      <div className="text-center space-y-4 max-w-2xl">
        <div className="text-xs font-mono text-cyan uppercase tracking-widest">
          Incoming Query
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-white leading-tight">
          {highlightKeyword(question)}
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
        <button
          onClick={() => onAnswer('Yes')}
          disabled={disabled}
          className="answer-btn hover:border-cyan hover:text-cyan hover:shadow-cyan"
        >
          [ YES ] <span className="block text-xs mt-1 opacity-50">(Y)</span>
        </button>
        <button
          onClick={() => onAnswer('No')}
          disabled={disabled}
          className="answer-btn hover:border-magenta hover:text-magenta hover:shadow-magenta"
        >
          [ NO ] <span className="block text-xs mt-1 opacity-50">(N)</span>
        </button>
        <button
          onClick={() => onAnswer('Maybe')}
          disabled={disabled}
          className="answer-btn hover:border-yellow-term hover:text-yellow-term"
        >
          [ MAYBE ] <span className="block text-xs mt-1 opacity-50">(M)</span>
        </button>
        <button
          onClick={() => onAnswer('Unknown')}
          disabled={disabled}
          className="answer-btn hover:border-gray-400 hover:text-gray-300"
        >
          [ ? ] <span className="block text-xs mt-1 opacity-50">(U)</span>
        </button>
      </div>
    </div>
  );
}
