'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, HelpCircle, Info, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function VibrantPitchStage({ question, questionCount, onAnswer, isThinking }) {
  const syncProgress = Math.min(100, (questionCount / 20) * 100 + 15);
  const [timer, setTimer] = useState(30);

  // Handle the 30s countdown during loading
  useEffect(() => {
    let interval;
    if (isThinking) {
      setTimer(30);
      interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      setTimer(30);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isThinking]);

  return (
    <div className="flex-1 h-full relative overflow-hidden flex flex-col items-center justify-center p-6 lg:p-12 pb-32">
      {/* Loading Overlay */}
      <AnimatePresence>
        {isThinking && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/70 backdrop-blur-xl flex flex-col items-center justify-center space-y-8"
          >
            <div className="relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 rounded-full border-2 border-t-[#C4A484] border-white/5"
                />
            </div>
            
            <div className="text-center space-y-3">
                <div className="flex items-center justify-center space-x-3">
                   <Loader2 className="w-4 h-4 text-[#C4A484] animate-spin" />
                   <div className="text-[#C4A484] font-mono text-xs tracking-[0.6em] uppercase font-bold animate-pulse">
                     Synthesizing Neural Path
                   </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000 scale-105"
        style={{ backgroundImage: `url('/vibrant2.png')` }}
      />
      {/* Overlay for depth */}
      <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[2px]" />

      <div className="relative z-20 w-full max-w-5xl flex flex-col items-center justify-center h-full">
        {/* Question Counter Badge */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="px-6 py-2 border border-white/5 bg-white/[0.02] backdrop-blur-md rounded-full mb-10 shadow-lg"
        >
          <span className="text-[10px] font-mono text-[#C4A484]/70 uppercase tracking-[0.25em]">
            QUESTION <span className="text-[#C4A484] font-bold italic">{String(questionCount + 1).padStart(2, '0')}</span> <span className="opacity-30">/</span> <span className="opacity-30">20</span>
          </span>
        </motion.div>

        {/* Question Text */}
        <motion.h1 
          key={question}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-7xl font-serif text-[#E0E0E0] text-center leading-[1.1] mb-16 drop-shadow-2xl max-w-4xl italic font-medium"
        >
          {question.replace(/\*\*/g, '')}
        </motion.h1>

        {/* Glassmorphism Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-6xl mb-24 px-4">
          <GlassButton 
            label="YES" 
            icon={<Check className="w-5 h-5 text-white" />} 
            iconColor="bg-blue-500/40"
            onClick={() => onAnswer('Yes')} 
            disabled={isThinking}
          />
          <GlassButton 
            label="NO" 
            icon={<X className="w-5 h-5 text-white" />} 
            iconColor="bg-red-500/40"
            onClick={() => onAnswer('No')} 
            disabled={isThinking}
          />
          <GlassButton 
            label="PROBABLY" 
            icon={<HelpCircle className="w-5 h-5 text-white/80" />} 
            iconColor="bg-white/5"
            onClick={() => onAnswer('Maybe')} 
            disabled={isThinking}
          />
          <GlassButton 
            label="UNKNOWN" 
            icon={<div className="w-5 h-0.5 bg-white/60" />} 
            iconColor="bg-white/5"
            onClick={() => onAnswer('Unknown')} 
            disabled={isThinking}
          />
        </div>
      </div>

      {/* Full-width Sticky Bottom HUD */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="w-full bg-white/[0.01] backdrop-blur-3xl border-t border-white/5 p-8 pt-6 pb-10 shadow-2xl pointer-events-auto"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C4A484] animate-pulse" />
                <span className="text-[10px] font-mono text-[#C4A484]/40 uppercase tracking-[0.4em]">PREDICTION</span>
              </div>
              <span className="text-[10px] font-mono text-[#C4A484] tracking-widest font-bold">
                {syncProgress.toFixed(0)}% ACCURACY
              </span>
            </div>
            
            <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[#C4A484]"
                initial={{ width: 0 }}
                animate={{ width: `${syncProgress}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function GlassButton({ label, icon, iconColor, onClick, disabled }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className="relative flex flex-col items-center justify-center space-y-2 md:space-y-4 h-28 md:h-40 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl transition-all shadow-xl group disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center border border-white/20 transition-transform group-hover:scale-110 ${iconColor || 'bg-white/5'}`}>
        {icon}
      </div>
      <div className="text-[10px] md:text-[12px] font-bold text-white/70 tracking-[0.2em] md:tracking-[0.4em] uppercase group-hover:text-white transition-colors">{label}</div>
    </motion.button>
  );
}
