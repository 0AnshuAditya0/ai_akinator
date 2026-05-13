'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function PitchStage({ question, confidence, onAnswer, isThinking }) {
  const [hoveredButton, setHoveredButton] = useState(null);

  const keywordMatch = question.match(/\*\*(.*?)\*\*/);
  const keyword = keywordMatch ? keywordMatch[1] : null;
  const displayQuestion = question.replace(/\*\*/g, '');

  return (
    <div className="flex-1 h-full bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Subtle grass texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 40px,
            #1e293b 40px,
            #1e293b 80px
          )`
        }}
      />
      
      {/* 3D-ish CSS Cricket ball (Day version) */}
      <div className="relative mb-16">
        <motion.div
          animate={{ 
            rotateY: isThinking ? 360 : 0,
            rotateX: isThinking ? [0, 10, -10, 0] : 0
          }}
          transition={{ 
            rotateY: { duration: 2, repeat: Infinity, ease: "linear" },
            rotateX: { duration: 0.8, repeat: Infinity }
          }}
          className="w-32 h-32 rounded-full bg-gradient-to-br from-red-600 via-red-700 to-red-900 relative shadow-xl border-2 border-white/20"
        >
          {/* Seam lines */}
          <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-white/40 transform rotate-45" />
          <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-white/40 transform -rotate-45" />
          <div className="absolute inset-2 rounded-full border border-white/10 opacity-30" />
        </motion.div>
        
        {/* Thinking pulse */}
        {isThinking && (
          <motion.div 
            className="absolute inset-[-40px] rounded-full border-4 border-blue-500/20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>

      {/* Question Heading */}
      <div className="text-center mb-16 max-w-3xl px-4 relative">
        <div className="text-slate-400 text-[10px] font-mono tracking-[0.4em] mb-4 uppercase font-bold">
          {isThinking ? 'Processing Intelligence...' : 'Incoming Delivery'}
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tighter uppercase italic">
          {keyword ? (
            <>
              {displayQuestion.split(keyword)[0]}
              <span className="text-blue-600 bg-blue-50 px-2 rounded mx-1">
                {keyword}
              </span>
              {displayQuestion.split(keyword)[1]}
            </>
          ) : displayQuestion}
        </h1>
      </div>

      {/* Clean Light Buttons */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-xl">
        {[
          { label: 'YES', key: 'Yes', color: 'emerald', icon: '✓' },
          { label: 'NO', key: 'No', color: 'rose', icon: '✕' },
          { label: 'MAYBE', key: 'Maybe', color: 'amber', icon: '≈' },
          { label: 'UNKNOWN', key: 'Unknown', color: 'slate', icon: '?' }
        ].map((btn) => (
          <motion.button
            key={btn.key}
            onClick={() => onAnswer(btn.key)}
            onMouseEnter={() => setHoveredButton(btn.key)}
            onMouseLeave={() => setHoveredButton(null)}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative h-24 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col items-center justify-center space-y-1`}
          >
            <span className={`text-2xl font-bold text-${btn.color}-600`}>{btn.icon}</span>
            <span className={`text-xs font-black tracking-widest text-${btn.color}-600`}>{btn.label}</span>
            
            <div className={`absolute bottom-0 left-0 h-1 bg-${btn.color}-500 w-0 group-hover:w-full transition-all duration-300`} />
          </motion.button>
        ))}
      </div>

      {/* Confidence Hud (Light) */}
      <div className="absolute bottom-12 w-full max-w-xl px-8">
        <div className="flex justify-between text-slate-400 text-[10px] font-mono mb-3 tracking-widest uppercase font-black">
          <span>Neural Confidence</span>
          <span className="text-blue-600">{confidence.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden border border-white shadow-inner">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1, ease: "circOut" }}
          />
        </div>
      </div>
    </div>
  );
}
