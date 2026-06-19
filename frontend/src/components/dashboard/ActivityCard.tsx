'use client';

export function ActivityCard() {
  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-6 flex flex-col justify-between h-full group relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 z-10">
        <h3 className="text-slate-900 dark:text-white font-bold text-lg">Activity</h3>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center relative min-h-[140px] z-10">
        {/* Large Blue Circle */}
        <div className="absolute w-28 h-28 bg-blue-500/10 dark:bg-blue-500/20 backdrop-blur-md rounded-full flex items-center justify-center border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] z-10 -ml-12 animate-blob">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner shadow-white/30">
            55%
          </div>
        </div>
        
        {/* Medium Pink Circle */}
        <div className="absolute w-20 h-20 bg-pink-500/10 dark:bg-pink-500/20 backdrop-blur-md rounded-full flex items-center justify-center border border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.15)] z-20 top-2 right-4 animate-blob" style={{ animationDelay: '2s' }}>
          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-inner shadow-white/30">
            30%
          </div>
        </div>

        {/* Small Yellow Circle */}
        <div className="absolute w-16 h-16 bg-yellow-500/10 dark:bg-yellow-500/20 backdrop-blur-md rounded-full flex items-center justify-center border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.15)] z-30 bottom-0 right-16 animate-blob" style={{ animationDelay: '4s' }}>
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-[10px] shadow-inner shadow-white/30">
            15%
          </div>
        </div>
      </div>
      
      <div className="flex justify-center gap-4 mt-6 z-10">
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Daily</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]"></span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Weekly</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.8)]"></span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Monthly</span>
         </div>
      </div>
    </div>
  );
}
