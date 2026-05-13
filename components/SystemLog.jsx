'use client';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SystemLog({ logs, isOpen, toggleOpen }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className={`
      fixed lg:static top-0 left-0 h-full w-full lg:w-72 bg-surface border-r border-border
      transform transition-transform duration-300 z-50 flex flex-col
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="p-4 border-b border-border flex justify-between items-center bg-elevated">
        <h2 className="text-cyan text-sm font-mono tracking-widest uppercase">SYSTEM_LOG</h2>
        <button onClick={toggleOpen} className="lg:hidden text-cyan font-mono hover:text-white">
          [X]
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
        <AnimatePresence initial={false}>
          {logs.map((log) => {
            let color = 'text-gray-400';
            if (log.tag === 'INF') color = 'text-cyan';
            if (log.tag === 'USR') color = 'text-white';
            if (log.tag === 'ERR') color = 'text-magenta';
            if (log.tag === 'RTR') color = 'text-yellow-term';
            if (log.tag === 'FLL') color = 'text-orange-term';

            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="leading-relaxed"
              >
                <span className="text-gray-600">[{log.time}]</span>{' '}
                <span className={color}>[{log.tag}]:</span>{' '}
                <span className={color === 'text-white' ? 'text-white' : 'text-gray-300'}>
                  {log.message}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
