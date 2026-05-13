'use client';
import { motion } from 'framer-motion';

export default function ProgressBar({ current, total }) {
  const progress = Math.min((current / total) * 100, 100);

  return (
    <div className="w-full bg-black border-b border-border p-2 flex items-center justify-between font-mono text-xs text-gray-500">
      <div className="flex-1 flex items-center space-x-4">
        <span>[SYS_LOAD]</span>
        <div className="h-1 flex-1 bg-surface relative overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 h-full bg-cyan"
          />
        </div>
      </div>
      <div className="w-24 text-right">
        {current} / {total}
      </div>
    </div>
  );
}
