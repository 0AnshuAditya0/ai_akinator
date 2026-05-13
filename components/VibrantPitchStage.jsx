'use client';
import { motion } from 'framer-motion';
import { Check, X, HelpCircle, Info } from 'lucide-react';

export default function VibrantPitchStage({ question, questionCount, onAnswer, isThinking }) {
  const syncProgress = Math.min(100, (questionCount / 20) * 100 + 15);

  return (
    <div className="flex-1 h-full relative overflow-hidden flex flex-col items-center justify-center p-6 lg:p-12 pb-32">
      {/* Background Image - Switch to vibrant2.png */}
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

        {/* Glassmorphism Buttons - Added margin bottom to avoid HUD overlap */}
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
      
      {/* Decorative corner star - repositioned to not overlap HUD */}
      <div className="absolute bottom-32 right-10 z-20 opacity-10 pointer-events-none">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1">
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="white" />
        </svg>
      </div>
    </div>
  );
}

function GlassButton({ label, icon, iconColor, onClick, disabled }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className="relative flex flex-col items-center justify-center space-y-4 h-40 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl transition-all shadow-2xl group disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center border border-white/20 transition-transform group-hover:scale-110 ${iconColor || 'bg-white/5'}`}>
        {icon}
      </div>
      <div className="text-[12px] font-bold text-white/70 tracking-[0.4em] uppercase group-hover:text-white transition-colors">{label}</div>
    </motion.button>
  );
}
