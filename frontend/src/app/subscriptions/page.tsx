'use client';

import { useEffect, useState } from 'react';
import { api, Subscription } from '@/lib/api';
import { Calendar } from 'lucide-react';

function brl(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

function daysUntil(dateStr: string) {
  const diff = Math.round((new Date(dateStr).getTime() - Date.now()) / 86400000);
  if (diff < 0) return { label: 'vencida', color: 'text-red-600 dark:text-red-400' };
  if (diff === 0) return { label: 'hoje', color: 'text-amber-600 dark:text-amber-400' };
  if (diff === 1) return { label: 'amanhã', color: 'text-amber-600 dark:text-amber-400' };
  return { label: `em ${diff} dias`, color: 'text-slate-500' };
}

const FREQ_COLORS: Record<string, string> = {
  semanal: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
  quinzenal: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  mensal: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  anual: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-400',
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSubscriptions().then(setSubscriptions).finally(() => setLoading(false));
  }, []);

  const totalMensal = subscriptions.reduce((sum, s) => {
    if (s.frequency === 'mensal') return sum + s.amount;
    if (s.frequency === 'semanal') return sum + s.amount * 4.3;
    if (s.frequency === 'quinzenal') return sum + s.amount * 2;
    if (s.frequency === 'anual') return sum + s.amount / 12;
    return sum;
  }, 0);

  return (
    <div className="py-2">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-slate-200/50 dark:border-slate-700/50 pb-5">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-1">Assinaturas</h1>
          <p className="text-slate-600 dark:text-slate-400 text-base">Pagamentos recorrentes detectados</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">Carregando...</div>
        ) : subscriptions.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-sm font-medium">Nenhuma assinatura detectada</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-600/20">
                <p className="text-white/70 text-xs font-semibold mb-2">Custo Estimado</p>
                <p className="text-3xl font-bold">{brl(totalMensal)}/mês</p>
              </div>
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 shadow-sm dark:shadow-lg dark:shadow-black/20 border border-slate-200/50 dark:border-slate-700/50">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">Detectadas</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{subscriptions.length}</p>
              </div>
            </div>

            {/* List */}
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-sm dark:shadow-lg dark:shadow-black/20 border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
              <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                {subscriptions.map((sub, idx) => {
                  const next = daysUntil(sub.next_charge);
                  return (
                    <div key={idx} className="flex items-center gap-4 px-6 py-5 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">{sub.description}</p>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${FREQ_COLORS[sub.frequency]}`}>
                            {sub.frequency}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className={next.color}>Próxima: {next.label}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-slate-900 dark:text-white">{brl(sub.amount)}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">/{sub.frequency.charAt(0)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
