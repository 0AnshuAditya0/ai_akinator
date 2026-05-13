'use client';

export default function InningsLog({ history, confidence, poolSize }) {
  const entropy = poolSize > 0 ? Math.log2(poolSize) : 0;

  return (
    <div className="w-80 h-full bg-white border-r border-slate-200 p-6 font-mono text-xs hidden lg:flex flex-col shadow-sm">
      <div className="text-blue-600 font-bold mb-6 tracking-[0.2em] uppercase border-b border-slate-100 pb-2">Innings Log</div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {history.length === 0 && (
          <div className="text-slate-400 italic">Waiting for first delivery...</div>
        )}
        {history.map((h, i) => (
          <div key={i} className="mb-4 border-l-2 border-slate-100 pl-4 py-1">
            <div className="text-slate-400 text-[10px] mb-1 tracking-widest uppercase">
              OVER {(i / 6 + 1).toFixed(1)}
            </div>
            <div className={`text-sm leading-tight font-medium ${
              h.answer === 'Yes' ? 'text-emerald-600' : 
              h.answer === 'No' ? 'text-rose-600' : 
              'text-amber-600'
            }`}>
              {h.question}
            </div>
            <div className="text-slate-500 mt-2 text-[10px] font-bold">
              → {h.answer.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-slate-100 space-y-6">
        <div>
          <div className="text-slate-400 text-[10px] tracking-widest mb-2 uppercase">Neural Entropy</div>
          <div className="text-blue-600 text-2xl font-bold">{entropy.toFixed(2)} bits</div>
        </div>
        
        <div>
          <div className="text-slate-400 text-[10px] tracking-widest mb-2 uppercase">Candidate Pool</div>
          <div className="text-slate-800 text-lg font-bold">{poolSize} active players</div>
        </div>
        
        <div className="h-40 bg-slate-50 rounded-lg border border-slate-100 relative overflow-hidden shadow-inner">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-28 border border-slate-200 opacity-40" />
          {Array.from({length: Math.min(poolSize, 11)}).map((_, i) => (
            <div 
              key={i}
              className="absolute w-2 h-2 rounded-full bg-blue-500 shadow-sm"
              style={{
                top: `${20 + (i * 7) % 60}%`,
                left: `${20 + (i * 13) % 60}%`,
                opacity: 0.4 + (Math.random() * 0.6)
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
