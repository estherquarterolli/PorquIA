'use client';

export function GoalsCard() {
  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-6 flex flex-col justify-between h-full group">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-slate-900 dark:text-white font-bold text-lg">Goals</h3>
        <button className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div className="space-y-8 flex-1">
        {/* Goal 1 */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Business Funding</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">$20,000</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800/50 rounded-full h-3 overflow-hidden shadow-inner shadow-slate-200/50 dark:shadow-black/50">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full relative" style={{ width: '80%' }}>
              <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 blur-[2px]"></div>
            </div>
          </div>
          <div className="flex justify-between mt-2">
             <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Achieved 80%</span>
             <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Target $25,000</span>
          </div>
        </div>

        {/* Goal 2 */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Top Up Balance</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">$7,000</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800/50 rounded-full h-3 overflow-hidden shadow-inner shadow-slate-200/50 dark:shadow-black/50">
            <div className="bg-gradient-to-r from-pink-500 to-rose-400 h-full rounded-full relative" style={{ width: '70%' }}>
              <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 blur-[2px]"></div>
            </div>
          </div>
          <div className="flex justify-between mt-2">
             <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Achieved 70%</span>
             <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Target $10,000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
