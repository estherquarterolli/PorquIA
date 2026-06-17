'use client';

import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { api, MonthlyData } from '@/lib/api';

const COLORS = ['#d946ef', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#a855f7', '#f43f5e'];

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function DashboardCharts({ porCategoria }: { porCategoria: Record<string, number> }) {
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);

  useEffect(() => {
    api.getMonthlyData(6).then(setMonthly).catch(() => {});
  }, []);

  const pieData = Object.entries(porCategoria || {})
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const hasPie = pieData.length > 0;
  const hasBars = monthly.some((m) => m.despesas > 0 || m.receitas > 0);

  return (
    <section className="space-y-5">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Análise</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Despesas por categoria */}
        <div className="rounded-3xl p-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Despesas por categoria</p>
          {hasPie ? (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-1/2 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => brl(Number(v))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full sm:w-1/2 space-y-2">
                {pieData.slice(0, 6).map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300 capitalize">
                      <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      {d.name}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white tabular-nums">{brl(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyChart />
          )}
        </div>

        {/* Receitas x Despesas por mês */}
        <div className="rounded-3xl p-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Receitas × Despesas (6 meses)</p>
          {hasBars ? (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <Tooltip formatter={(v) => brl(Number(v))} cursor={{ fill: 'rgba(148,163,184,0.1)' }} />
                  <Legend />
                  <Bar dataKey="receitas" name="Receitas" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="despesas" name="Despesas" fill="#ec4899" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyChart />
          )}
        </div>
      </div>
    </section>
  );
}

function EmptyChart() {
  return (
    <div className="h-52 flex items-center justify-center text-sm text-slate-400 dark:text-slate-500">
      Sem dados suficientes ainda
    </div>
  );
}
