'use client';

import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface StatCardProps {
  title: string;
  value: string;
  data: { value: number }[];
  color: string;
  gradientId: string;
  gradientColors: [string, string];
}

export function StatCard({ title, value, data, color, gradientId, gradientColors }: StatCardProps) {
  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-6 flex flex-col justify-between h-full group">
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1 tracking-wide">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
      </div>
      
      <div className="h-16 mt-4 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={gradientColors[0]} />
                <stop offset="100%" stopColor={gradientColors[1]} />
              </linearGradient>
            </defs>
            <Line
              type="monotone"
              dataKey="value"
              stroke={`url(#${gradientId})`}
              strokeWidth={4}
              dot={false}
              isAnimationActive={true}
              style={{ filter: `drop-shadow(0px 4px 6px ${gradientColors[1]}40)` }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
