'use client';

import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { value: 40 },
  { value: 60 },
  { value: 35 },
  { value: 80 },
  { value: 45 },
  { value: 70 },
  { value: 50 },
];

export function BalanceCard() {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-950 rounded-3xl p-6 text-white shadow-lg shadow-blue-600/30 dark:shadow-blue-900/40 flex flex-col justify-between h-full relative overflow-hidden glass-panel-hover">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="z-10">
        <p className="text-blue-100/80 text-sm font-medium mb-1 tracking-wide">Total Balance</p>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">$4,509<span className="text-2xl text-blue-200">.00</span></h2>
      </div>

      <div className="h-20 mt-6 w-full z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Bar dataKey="value" radius={[4, 4, 4, 4]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 3 ? '#ffffff' : 'rgba(255,255,255,0.2)'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
