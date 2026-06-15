'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Successful', value: 65, color: '#2563eb' },
  { name: 'Pending', value: 35, color: '#facc15' },
];

export function PaymentsCard() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex flex-col justify-between h-full group hover:shadow-md transition-shadow relative">
      <div className="flex items-center justify-between mb-4 z-10">
        <h3 className="text-gray-900 font-bold text-lg">Payments</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      <div className="flex-1 w-full relative min-h-[160px] flex items-center justify-center">
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
          <span className="text-3xl font-bold text-gray-900">65%</span>
          <span className="text-xs text-gray-500 font-medium">Successful</span>
        </div>
        
        <ResponsiveContainer width="100%" height="100%" className="z-10">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              cornerRadius={10}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-between items-center mt-4 px-2">
         <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
               <span className="w-2 h-2 rounded-full bg-blue-600"></span>
               <span className="text-xs text-gray-500 font-medium">Successful</span>
            </div>
            <span className="text-sm font-bold text-gray-900">65%</span>
         </div>
         <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
               <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
               <span className="text-xs text-gray-500 font-medium">Pending</span>
            </div>
            <span className="text-sm font-bold text-gray-900">35%</span>
         </div>
      </div>
    </div>
  );
}
