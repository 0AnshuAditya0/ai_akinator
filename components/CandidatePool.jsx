'use client';
import { motion } from 'framer-motion';

export default function CandidatePool({ candidates }) {
  if (!candidates || candidates.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto border border-border bg-elevated p-6 mt-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan to-transparent opacity-50" />
      
      <div className="flex justify-between items-end mb-6">
        <h3 className="font-mono text-cyan text-sm tracking-widest uppercase">Live Pool View</h3>
        <span className="font-mono text-xs text-gray-500">Top {candidates.length}</span>
      </div>

      <div className="space-y-4">
        {candidates.map((candidate, idx) => (
          <div key={candidate.name} className="flex flex-col gap-1">
            <div className="flex justify-between font-mono text-sm">
              <span className="text-gray-300">
                <span className="text-gray-600 mr-2">#{String(idx + 1).padStart(2, '0')}</span>
                {candidate.name}
              </span>
              <span className="text-cyan">{candidate.probability.toFixed(1)}%</span>
            </div>
            <div className="w-full h-1 bg-surface rounded overflow-hidden">
              <motion.div
                layout
                initial={{ width: 0 }}
                animate={{ width: `${candidate.probability}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="prob-bar"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
