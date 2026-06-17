'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fmtBRL, mockMonthly } from '@/lib/mock';
import type { MonthlyData } from '@/lib/api';

interface IncomeExpenseChartProps {
  data?: MonthlyData[];
}

export function IncomeExpenseChart({ data = mockMonthly }: IncomeExpenseChartProps) {
  const tooltipStyle = {
    borderRadius: '14px',
    border: 'none',
    boxShadow: '0 12px 32px rgba(76,29,149,0.25)',
    backgroundColor: 'rgba(20,15,36,0.92)',
    backdropFilter: 'blur(8px)',
    color: '#fff',
    fontSize: '13px',
    padding: '10px 14px',
  };
  return (
    <div className="card p-6 h-full flex flex-col">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">Receitas x Despesas</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Últimos 6 meses</p>
        </div>
        <div className="flex gap-4">
          <Legend color="#10b981" label="Receitas" />
          <Legend color="#f43f5e" label="Despesas" />
        </div>
      </div>

      <div className="flex-1 min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 6, right: 6, left: -14, bottom: 0 }} barGap={6}>
            <defs>
              <linearGradient id="gRec" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="gDesp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="currentColor" className="text-slate-200/70 dark:text-white/5" />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={8} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip cursor={{ fill: 'rgba(168,85,247,0.06)' }} contentStyle={tooltipStyle} formatter={(v: any) => fmtBRL(Number(v))} />
            <Bar dataKey="receitas" name="Receitas" fill="url(#gRec)" radius={[6, 6, 0, 0]} maxBarSize={22} />
            <Bar dataKey="despesas" name="Despesas" fill="url(#gDesp)" radius={[6, 6, 0, 0]} maxBarSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{label}</span>
    </div>
  );
}
