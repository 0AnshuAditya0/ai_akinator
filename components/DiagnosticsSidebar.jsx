'use client';

export default function DiagnosticsSidebar({ history, poolSize, topCandidates }) {
  return (
    <div className="w-full lg:w-96 h-full bg-[#050B18] text-[#E0E0E0] p-8 flex flex-col font-sans border-r border-white/5 relative z-30">
      {/* IPL Logo with background blending to remove white edges if any */}
      <div className="mb-12 flex justify-start">
        <div className="relative group">
          <img 
            src="/ipl.png" 
            alt="IPL Logo" 
            className="h-14 w-auto object-contain brightness-110 contrast-125" 
            style={{ mixBlendMode: 'screen' }} // Helps blend if the logo has a dark background or slight white edges
          />
        </div>
      </div>

      <div className="text-[10px] font-black tracking-[0.3em] text-[#C4A484] mb-10 uppercase opacity-90 border-b border-white/5 pb-2">
        Neural Game Diagnostics
      </div>

      {/* Diagnostics List - The History */}
      <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar mb-8">
        {history.length === 0 && (
          <div className="text-white/20 italic text-xs">Waiting for system input...</div>
        )}
        {history.map((h, i) => (
          <div key={i} className="relative pl-8 animate-in fade-in slide-in-from-left-2">
            <div className="absolute left-[3px] top-0 bottom-0 w-[1px] bg-white/10" />
            <div className="absolute left-0 top-1 w-[7px] h-[7px] rounded-full border border-white/20 bg-white/5" />
            
            <div className="text-[9px] font-bold text-white/30 uppercase mb-1 tracking-widest">State 0{i + 1}</div>
            <div className="text-xs leading-relaxed text-white/70 font-medium">
              {h.question}
            </div>
            <div className="text-[10px] text-[#00FFFF] mt-1 font-bold">
              [{h.answer.toUpperCase()}]
            </div>
          </div>
        ))}

        {/* Current Process */}
        {history.length > 0 && (
          <div className="relative pl-8">
            <div className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full bg-[#00FFFF] shadow-[0_0_15px_#00FFFF] animate-pulse" />
            <div className="text-[9px] font-bold text-[#00FFFF] uppercase mb-1 tracking-widest">Current Process</div>
            <div className="text-xs leading-relaxed text-white/40">
              Narrowing search vectors...
            </div>
          </div>
        )}
      </div>

      {/* Prediction Metrics - NEW */}
      <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
        <div className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Target Prediction Metrics</div>
        <div className="space-y-3">
          {topCandidates.slice(0, 3).map((candidate, idx) => (
            <div key={idx} className="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-white/80">{candidate.name}</span>
                <span className="text-[10px] font-mono text-[#00FFFF]">{candidate.probability.toFixed(1)}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#00FFFF] transition-all duration-1000" 
                  style={{ width: `${candidate.probability}%` }}
                />
              </div>
            </div>
          ))}
          {topCandidates.length === 0 && (
            <div className="text-white/10 text-[10px] text-center py-4">Awaiting data stream...</div>
          )}
        </div>
      </div>
    </div>
  );
}
