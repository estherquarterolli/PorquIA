'use client';

import { useEffect, useState } from 'react';
import { api, Subscription } from '@/lib/api';
import { fmtBRL } from '@/lib/mock';
import { Calendar, RotateCcw } from 'lucide-react';

function daysUntil(dateStr: string) {
  const diff = Math.round((new Date(dateStr).getTime() - Date.now()) / 86400000);
  if (diff < 0) return { label: 'vencida', color: 'text-rose-500' };
  if (diff === 0) return { label: 'hoje', color: 'text-amber-500' };
  if (diff === 1) return { label: 'amanhã', color: 'text-amber-500' };
  return { label: `em ${diff} dias`, color: 'text-slate-400' };
}

const FREQ_COLORS: Record<string, string> = {
  semanal: 'bg-rose-500/12 text-rose-600 dark:text-rose-400',
  quinzenal: 'bg-amber-500/12 text-amber-600 dark:text-amber-400',
  mensal: 'bg-brand-500/12 text-brand-600 dark:text-brand-300',
  anual: 'bg-slate-500/12 text-slate-600 dark:text-slate-300',
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSubscriptions().then(setSubscriptions).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalMensal = subscriptions.reduce((sum, s) => {
    if (s.frequency === 'mensal') return sum + s.amount;
    if (s.frequency === 'semanal') return sum + s.amount * 4.3;
    if (s.frequency === 'quinzenal') return sum + s.amount * 2;
    if (s.frequency === 'anual') return sum + s.amount / 12;
    return sum;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">Assinaturas</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pagamentos recorrentes detectados pela IA.</p>
      </div>

      {loading ? (
        <div className="card py-20 text-center text-slate-400 text-sm">Carregando…</div>
      ) : subscriptions.length === 0 ? (
        <div className="card py-16 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl brand-gradient-soft grid place-items-center text-2xl mb-3">🔁</div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Nenhuma assinatura detectada</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative overflow-hidden rounded-3xl p-6 brand-gradient text-white shadow-[0_18px_45px_-18px_rgba(168,85,247,0.7)]">
              <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/20 rounded-full blur-2xl" />
              <p className="text-white/75 text-xs font-semibold">Custo recorrente estimado</p>
              <p className="text-3xl font-bold tabular-nums mt-1">{fmtBRL(totalMensal)}<span className="text-base text-white/70">/mês</span></p>
            </div>
            <div className="card p-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <RotateCcw className="w-4 h-4" /> Assinaturas ativas
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{subscriptions.length}</p>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="divide-y divide-slate-200/60 dark:divide-white/5">
              {subscriptions.map((sub, idx) => {
                const next = daysUntil(sub.next_charge);
                return (
                  <div key={idx} className="flex items-center gap-4 px-5 py-4 hover:bg-brand-50/50 dark:hover:bg-white/5 transition-colors">
                    <span className="w-11 h-11 rounded-xl brand-gradient-soft grid place-items-center text-brand-600 dark:text-brand-300 shrink-0">
                      <RotateCcw className="w-5 h-5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">{sub.description}</p>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${FREQ_COLORS[sub.frequency]}`}>{sub.frequency}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs mt-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className={next.color}>Próxima cobrança {next.label}</span>
                      </div>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white tabular-nums shrink-0">{fmtBRL(sub.amount)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
