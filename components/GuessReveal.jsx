'use client';
import { motion, AnimatePresence } from 'framer-motion';

export default function GuessReveal({ isOpen, player, onFeedback }) {
  if (!player) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            className="relative bg-white/10 border border-white/10 p-12 rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden"
          >
            {/* Inner background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none" />

            <div className="text-center space-y-10 relative z-10">
              <div className="font-mono text-[#00FFFF] text-[10px] tracking-[0.5em] uppercase font-bold opacity-80">
                Identity Correlation Confirmed
              </div>
              
              <div className="space-y-4">
                <p className="text-white/40 font-mono text-xs uppercase tracking-widest">The machine identifies...</p>
                <h2 className="text-5xl md:text-7xl font-serif text-white italic leading-tight drop-shadow-2xl">
                  {player.name}
                </h2>
              </div>

              <div className="text-white/60 font-mono text-[10px] tracking-widest uppercase">
                {player.nationality} • {player.role} • {player.teams?.join(', ')}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-6 py-8 border-y border-white/5 bg-white/5 rounded-2xl">
                <div>
                  <div className="text-white text-3xl font-serif italic">{player.matches || '-'}</div>
                  <div className="text-white/30 text-[8px] font-bold tracking-widest uppercase mt-1">Matches</div>
                </div>
                <div>
                  <div className="text-white text-3xl font-serif italic">{player.runs || '-'}</div>
                  <div className="text-white/30 text-[8px] font-bold tracking-widest uppercase mt-1">Runs</div>
                </div>
                <div>
                  <div className="text-white text-3xl font-serif italic">{player.wickets || '-'}</div>
                  <div className="text-white/30 text-[8px] font-bold tracking-widest uppercase mt-1">Wickets</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
                <button
                  onClick={() => onFeedback(true)}
                  className="px-10 py-4 bg-[#C4A484] text-white font-bold tracking-widest hover:bg-[#A6896A] transition-all rounded-full shadow-lg uppercase text-xs"
                >
                  Confirm Diagnostic
                </button>
                <button
                  onClick={() => onFeedback(false)}
                  className="px-10 py-4 bg-white/5 border border-white/10 text-white font-bold tracking-widest hover:bg-white/10 transition-all rounded-full uppercase text-xs"
                >
                  Challenge Call
                </button>
              </div>
            </div>
            
            {/* Corner Bracket visuals */}
            <div className="absolute top-8 left-8 w-8 h-8 border-t border-l border-white/20 rounded-tl-2xl" />
            <div className="absolute bottom-8 right-8 w-8 h-8 border-b border-r border-white/20 rounded-br-2xl" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
