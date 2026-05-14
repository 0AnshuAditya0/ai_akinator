'use client';

export default function DiagnosticsSidebar({ history, poolSize, topCandidates }) {
  return (
    <div className="w-full lg:w-96 h-full bg-[#000000] text-[#E0E0E0] p-8 flex flex-col font-sans border-r border-white/5 relative z-30">
      {/* IPL Logo with background blending to remove white edges if any */}
      {/* Logo and Website Name */}
      <div className="mb-12 flex items-center space-x-3">
        <div className="relative group">
          <img 
            src="/ipl.jpeg" 
            alt="IPL Logo" 
            className="h-12 w-auto object-contain brightness-110 contrast-125 rounded-md shadow-lg" 
          />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-serif italic font-bold text-[#C4A484] tracking-tight">Cricket</span>
        </div>
      </div>

      {/* Live Badge */}
      <div className="mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/[0.02] border border-white/5 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-[#C4A484]/60 uppercase tracking-widest">READY</span>
        </div>
      </div>

      <div className="text-[10px] font-black tracking-[0.3em] text-[#C4A484]/30 mb-10 uppercase border-b border-white/5 pb-2">
        LOGS
      </div>

      {/* Diagnostics List - The History */}
      <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar mb-8">
        {history.length === 0 && (
          <div className="text-white/20 italic text-xs">Waiting for system input...</div>
        )}
        {history.map((h, i) => (
          <div key={i} className="relative pl-8 animate-in fade-in slide-in-from-left-2">
            <div className="absolute left-[3px] top-0 bottom-0 w-[1px] bg-white/10" />
            <div className="absolute left-0 top-1 w-[5px] h-[5px] rounded-full border border-[#C4A484]/20 bg-[#C4A484]/5" />
            
            <div className="text-[9px] font-bold text-white/30 uppercase mb-1 tracking-widest">State 0{i + 1}</div>
            <div className="text-xs leading-relaxed text-white/60 font-medium">
              {h.question}
            </div>
            <div className="text-[10px] text-[#C4A484] mt-1 font-bold">
              [{h.answer.toUpperCase()}]
            </div>
          </div>
        ))}

        {/* Current Process */}
        {history.length > 0 && (
          <div className="relative pl-8">
            <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-[#C4A484] shadow-[0_0_10px_#C4A484] animate-pulse" />
            <div className="text-[9px] font-bold text-[#C4A484] uppercase mb-1 tracking-widest">Current Process</div>
            <div className="text-xs leading-relaxed text-white/20 italic">
              Narrowing search vectors...
            </div>
          </div>
        )}
      </div>

      {/* Prediction Metrics */}
      <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
        <div className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">PREDICTION MATRIX</div>
        <div className="space-y-3">
          {topCandidates.slice(0, 3).map((candidate, idx) => (
            <div key={idx} className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-white/60">{candidate.name}</span>
                <span className="text-[10px] font-mono text-[#C4A484]">{candidate.probability.toFixed(1)}%</span>
              </div>
              <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#C4A484] transition-all duration-1000" 
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
