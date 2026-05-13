'use client';
import { motion, AnimatePresence } from 'framer-motion';

export default function GuessReveal({ isOpen, player, onFeedback }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ x: -1000, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-elevated border border-cyan p-8 w-full max-w-lg relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-cyan" />
            <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-cyan to-transparent opacity-30" />
            
            <div className="text-center space-y-6 relative z-10">
              <div className="font-mono text-cyan text-sm tracking-widest uppercase">
                Neural Match Found
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-400 font-mono text-xs">You are thinking of...</p>
                <h2 className="text-4xl md:text-5xl font-bold text-white text-glow-cyan uppercase tracking-wide">
                  {player}
                </h2>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => onFeedback(true)}
                  className="bg-green-term/10 text-green-term border border-green-term px-6 py-3 font-mono text-sm hover:bg-green-term hover:text-black transition-colors"
                >
                  [ YES, THAT'S CORRECT ]
                </button>
                <button
                  onClick={() => onFeedback(false)}
                  className="bg-magenta/10 text-magenta border border-magenta px-6 py-3 font-mono text-sm hover:bg-magenta hover:text-white transition-colors"
                >
                  [ NO, TRY AGAIN ]
                </button>
              </div>
            </div>
            
            {/* Grid background effect */}
            <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
