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
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex flex-col h-full group hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-gray-900 font-bold text-lg">Sale</h3>
          <p className="text-sm text-gray-500 font-medium">Monthly comparison</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600"></span>
            <span className="text-sm text-gray-600 font-medium">This Month</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-pink-500"></span>
            <span className="text-sm text-gray-600 font-medium">Last Month</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
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
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Line 
              type="monotone" 
              dataKey="thisMonth" 
              stroke="#2563eb" 
              strokeWidth={4} 
              dot={{ r: 0 }} 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
            />
            <Line 
              type="monotone" 
              dataKey="lastMonth" 
              stroke="#ec4899" 
              strokeWidth={4} 
              dot={{ r: 0 }} 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#ec4899' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
