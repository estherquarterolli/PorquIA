'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Successful', value: 65, color: '#3b82f6' },
  { name: 'Pending', value: 35, color: '#eab308' },
];

export function PaymentsCard() {
  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-6 flex flex-col justify-between h-full group relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 z-10">
        <h3 className="text-slate-900 dark:text-white font-bold text-lg">Payments</h3>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      <div className="flex-1 w-full relative min-h-[160px] flex items-center justify-center">
        {/* Glow Effects */}
        <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 blur-2xl rounded-full w-32 h-32 mx-auto mt-4 pointer-events-none"></div>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <span className="text-4xl font-bold text-slate-900 dark:text-white drop-shadow-md">65%</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 tracking-wide">Successful</span>
        </div>
        
        <ResponsiveContainer width="100%" height="100%" className="z-20">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              cornerRadius={10}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  style={{ filter: `drop-shadow(0 0 8px ${entry.color}60)` }}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: '1px solid rgba(255,255,255,0.1)', 
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)', 
                backgroundColor: 'rgba(15,23,42,0.9)', 
                color: '#fff',
                backdropFilter: 'blur(10px)'
              }}
              itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-between items-center mt-6 px-2 z-10">
         <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
               <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
               <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Successful</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">65%</span>
         </div>
         <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
               <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]"></span>
               <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">35%</span>
         </div>
      </div>
    </div>
  );
}
