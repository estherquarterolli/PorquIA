'use client';

import { useEffect, useState } from 'react';
import { api, InvestmentSummary } from '@/lib/api';
import { fmtBRL } from '@/lib/mock';
import { InvestmentBarChart } from '@/components/Charts';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';

export default function InvestmentsPage() {
  const [data, setData] = useState<InvestmentSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getInvestmentSummary().then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const year = new Date().getFullYear();

  const stats = data ? [
    { label: 'Este mês', value: fmtBRL(data.totalMes), Icon: TrendingUp, color: '#10b981' },
    { label: `Ano ${year}`, value: fmtBRL(data.totalAno), Icon: Calendar, color: '#a855f7' },
    { label: 'Média 6m', value: fmtBRL(data.mediaMensal), Icon: BarChart3, color: '#3b82f6' },
  ] : [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">Investimentos</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Aportes na categoria investimento.</p>
      </div>

      {loading ? (
        <div className="card py-20 text-center text-slate-400 text-sm">Carregando…</div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="card card-hover p-5">
                <span className="w-10 h-10 rounded-xl grid place-items-center mb-3" style={{ backgroundColor: `${s.color}1f`, color: s.color }}>
                  <s.Icon className="w-5 h-5" />
                </span>
                <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-5">Aportes mensais</h3>
            <InvestmentBarChart data={data.historico} />
          </div>

          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200/60 dark:border-white/5">
              <h3 className="font-bold text-slate-900 dark:text-white">Últimos aportes</h3>
            </div>
            {data.ultimosAportes.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400">Nenhum aporte registrado</div>
            ) : (
              <div className="divide-y divide-slate-200/60 dark:divide-white/5">
                {data.ultimosAportes.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-brand-50/50 dark:hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl grid place-items-center text-lg" style={{ backgroundColor: '#22c55e1f' }}>📈</span>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">{tx.description}</p>
                        <p className="text-xs text-slate-400">{new Date(tx.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{fmtBRL(tx.amount)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
