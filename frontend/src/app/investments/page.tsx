'use client';

import { useEffect, useState } from 'react';
import { api, InvestmentSummary } from '@/lib/api';
import { InvestmentBarChart } from '@/components/Charts';

function brl(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

export default function InvestmentsPage() {
  const [data, setData] = useState<InvestmentSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getInvestmentSummary()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const year = new Date().getFullYear();

  return (
    <div className="py-2">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-slate-200/50 dark:border-slate-700/50 pb-5">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-1">Investimentos</h1>
          <p className="text-slate-600 dark:text-slate-400 text-base">Aportes em categoria investimento</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">Carregando...</div>
        ) : data ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 shadow-sm dark:shadow-lg dark:shadow-black/20 border border-slate-200/50 dark:border-slate-700/50 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mb-2">Este Mês</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{brl(data.totalMes)}</p>
              </div>
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 shadow-sm dark:shadow-lg dark:shadow-black/20 border border-slate-200/50 dark:border-slate-700/50 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mb-2">Ano {year}</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{brl(data.totalAno)}</p>
              </div>
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 shadow-sm dark:shadow-lg dark:shadow-black/20 border border-slate-200/50 dark:border-slate-700/50 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mb-2">Média 6m</p>
                <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{brl(data.mediaMensal)}</p>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 shadow-sm dark:shadow-lg dark:shadow-black/20 border border-slate-200/50 dark:border-slate-700/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Aportes Mensais</h3>
              <InvestmentBarChart data={data.historico} />
            </div>

            {/* Recent */}
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-sm dark:shadow-lg dark:shadow-black/20 border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200/50 dark:border-slate-700/50">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Últimos Aportes</h3>
              </div>
              <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                {data.ultimosAportes.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{tx.description}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{new Date(tx.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <p className="font-bold text-amber-600 dark:text-amber-400">{brl(tx.amount)}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
