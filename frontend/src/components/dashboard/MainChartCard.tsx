'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', thisMonth: 4000, lastMonth: 2400 },
  { name: 'Feb', thisMonth: 3000, lastMonth: 1398 },
  { name: 'Mar', thisMonth: 2000, lastMonth: 9800 },
  { name: 'Apr', thisMonth: 2780, lastMonth: 3908 },
  { name: 'May', thisMonth: 1890, lastMonth: 4800 },
  { name: 'Jun', thisMonth: 2390, lastMonth: 3800 },
  { name: 'Jul', thisMonth: 3490, lastMonth: 4300 },
];

export function MainChartCard() {
  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-6 flex flex-col h-full group">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-slate-900 dark:text-white font-bold text-lg">Sale</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Monthly comparison</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
            <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">This Month</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]"></span>
            <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">Last Month</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[250px] lg:min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800/50" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
            />
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
            <Line 
              type="monotone" 
              dataKey="thisMonth" 
              stroke="#3b82f6" 
              strokeWidth={4} 
              dot={{ r: 0 }} 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6', style: { filter: 'drop-shadow(0 0 8px #3b82f6)' } }}
              style={{ filter: 'drop-shadow(0px 4px 6px rgba(59,130,246,0.3))' }}
            />
            <Line 
              type="monotone" 
              dataKey="lastMonth" 
              stroke="#ec4899" 
              strokeWidth={4} 
              dot={{ r: 0 }} 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#ec4899', style: { filter: 'drop-shadow(0 0 8px #ec4899)' } }}
              style={{ filter: 'drop-shadow(0px 4px 6px rgba(236,72,153,0.3))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
