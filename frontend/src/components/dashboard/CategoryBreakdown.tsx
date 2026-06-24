'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { fmtBRL, mockSummary, categoryMeta } from '@/lib/mock';
import type { Summary } from '@/lib/api';

interface CategoryBreakdownProps {
  data?: Summary;
}

export function CategoryBreakdown({ data = mockSummary }: CategoryBreakdownProps) {
  const entries = Object.entries(data.porCategoria)
    .sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((s, [, v]) => s + v, 0);

  const chartData = entries.map(([cat, value]) => ({
    name: categoryMeta(cat).label,
    value,
    color: categoryMeta(cat).color,
  }));

  return (
    <div className="card p-6 h-full flex flex-col">
      <h3 className="font-bold text-slate-900 dark:text-white">Despesas por categoria</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Este mês</p>

      <div className="relative mx-auto my-2" style={{ width: 180, height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={86}
              paddingAngle={3}
              cornerRadius={6}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="text-center">
            <p className="text-[11px] text-slate-400 font-medium">Total</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">{fmtBRL(total)}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-2.5">
        {chartData.slice(0, 5).map((d) => (
          <div key={d.name} className="flex items-center gap-2.5 text-sm">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-slate-600 dark:text-slate-300 font-medium flex-1 truncate">{d.name}</span>
            <span className="text-slate-400 text-xs tabular-nums">{Math.round((d.value / total) * 100)}%</span>
            <span className="text-slate-900 dark:text-white font-semibold tabular-nums">{fmtBRL(d.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
