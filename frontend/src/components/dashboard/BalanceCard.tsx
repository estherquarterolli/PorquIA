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
    <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-600/30 flex flex-col justify-between h-full relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>

      <div>
        <p className="text-blue-100 text-sm font-medium mb-1">Total Balance</p>
        <h2 className="text-4xl font-bold tracking-tight">$4,509.00</h2>
      </div>

      <div className="h-16 mt-6 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Bar dataKey="value" radius={[4, 4, 4, 4]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 3 ? '#ffffff' : 'rgba(255,255,255,0.4)'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
