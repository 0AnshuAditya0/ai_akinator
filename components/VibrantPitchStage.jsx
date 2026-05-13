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
      {/* Loading Overlay with 30s Timer */}
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
                  className="w-24 h-24 rounded-full border-2 border-t-[#00FFFF] border-white/5"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-mono text-[#00FFFF] font-bold">
                  {timer}s
                </div>
            </div>
            
            <div className="text-center space-y-3">
                <div className="flex items-center justify-center space-x-3">
                   <Loader2 className="w-4 h-4 text-[#00FFFF] animate-spin" />
                   <div className="text-[#00FFFF] font-mono text-xs tracking-[0.6em] uppercase font-bold animate-pulse">
                     Synthesizing Neural Path
                   </div>
                </div>
                <div className="text-white/30 font-mono text-[9px] uppercase tracking-[0.2em] max-w-xs leading-relaxed">
                  The engine is cross-referencing {91 - questionCount} candidates. <br/>
                  Estimated completion: {timer > 15 ? 'OPTIONAL' : 'IMMINENT'}
                </div>
            </div>

            {/* Micro-progress bar for the timer */}
            <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: `${(timer / 30) * 100}%` }}
                  className="h-full bg-[#00FFFF]/40"
                />
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
          className="bg-[#C4A484] px-6 py-1 rounded-full mb-10 shadow-lg"
        >
          <span className="text-[9px] font-bold text-white uppercase tracking-[0.25em]">
            Question {questionCount + 1} of 20
          </span>
        </motion.div>

        {/* Question Text */}
        <motion.h1 
          key={question}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-7xl font-serif text-white text-center leading-[1.1] mb-16 drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)] max-w-4xl"
        >
          {question.replace(/\*\*/g, '')}
        </motion.h1>

        {/* Glassmorphism Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-24">
          <GlassButton 
            label="YES" 
            icon={<Check className="w-5 h-5 text-white" />} 
            iconColor="bg-blue-500/80"
            onClick={() => onAnswer('Yes')} 
            disabled={isThinking}
          />
          <GlassButton 
            label="NO" 
            icon={<X className="w-5 h-5 text-white" />} 
            iconColor="bg-red-500/80"
            onClick={() => onAnswer('No')} 
            disabled={isThinking}
          />
          <GlassButton 
            label="PROBABLY" 
            icon={<HelpCircle className="w-5 h-5 text-[#C4A484]" />} 
            onClick={() => onAnswer('Maybe')} 
            disabled={isThinking}
          />
          <GlassButton 
            label="UNKNOWN" 
            icon={<Info className="w-5 h-5 text-white/60" />} 
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
          className="w-full bg-white/[0.03] backdrop-blur-3xl border-t border-white/10 p-8 pt-6 pb-10 shadow-[0_-20px_60px_rgba(0,0,0,0.4)] pointer-events-auto"
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00FFFF] shadow-[0_0_10px_#00FFFF] animate-pulse" />
                <span className="text-xs font-black text-white/70 uppercase tracking-[0.4em]">Strategy Integrity</span>
              </div>
              <span className="text-xs font-mono text-[#00FFFF] tracking-widest font-bold">
                {syncProgress.toFixed(0)}% SYNCHRONIZED
              </span>
            </div>
            
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-600 via-[#00FFFF] to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${syncProgress}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>

            <div className="mt-4 flex justify-between items-center opacity-30 text-[9px] font-mono tracking-[0.6em] text-white uppercase">
              <span>Sector Analysis: ACTIVE</span>
              <span>Neural Pathing: SECURE</span>
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
      className="relative flex flex-col items-center justify-center space-y-4 h-40 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl transition-all shadow-xl group disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center border border-white/20 transition-transform group-hover:scale-110 ${iconColor || 'bg-white/5'}`}>
        {icon}
      </div>
      <div className="text-[12px] font-bold text-white/70 tracking-[0.4em] uppercase group-hover:text-white transition-colors">{label}</div>
    </motion.button>
  );
}
