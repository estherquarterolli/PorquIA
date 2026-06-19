'use client';

import { useEffect, useState } from 'react';
import { api, UpcomingMonth } from '@/lib/api';
import { ChevronDown, CalendarClock, TrendingDown, TrendingUp } from 'lucide-react';

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const CATEGORY_EMOJI: Record<string, string> = {
  alimentação: '🍔', transporte: '🚗', moradia: '🏠', saúde: '💊',
  lazer: '🎮', educação: '📚', vestuário: '👕', serviços: '🔧',
  investimento: '📈', outros: '📦',
};

export default function UpcomingPage() {
  const [months, setMonths] = useState<UpcomingMonth[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    api.getUpcoming(6).then((r) => setMonths(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalFuturo = months.reduce((s, m) => s + m.despesas, 0);
  const hasData = months.some((m) => m.items.length > 0);

  return (
    <div className="py-2">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="border-b border-slate-200/50 dark:border-zinc-800 pb-5">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-1">Próximos Meses</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Parcelas e gastos fixos já agendados</p>
        </div>

        {/* Total previsto */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-xl shadow-orange-500/30">
          <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
            <CalendarClock className="w-4 h-4" /> Total previsto (6 meses)
          </div>
          <p className="text-3xl sm:text-4xl font-bold mt-2">{brl(totalFuturo)}</p>
        </div>

        {loading ? (
          <p className="text-center text-slate-400 py-8">Carregando...</p>
        ) : !hasData ? (
          <div className="text-center py-12 text-slate-400">
            <CalendarClock className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">Nenhum gasto agendado para os próximos meses</p>
            <p className="text-xs mt-1">Adicione parcelas ou gastos fixos para vê-los aqui.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {months.map((m) => (
              <div key={m.month} className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpen(open === m.month ? null : m.month)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="text-left">
                    <p className="font-bold text-slate-900 dark:text-white capitalize">{m.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{m.items.length} lançamento(s)</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      {m.despesas > 0 && (
                        <p className="text-sm font-bold text-rose-500 flex items-center gap-1 justify-end">
                          <TrendingDown className="w-3 h-3" /> {brl(m.despesas)}
                        </p>
                      )}
                      {m.receitas > 0 && (
                        <p className="text-xs font-semibold text-emerald-500 flex items-center gap-1 justify-end">
                          <TrendingUp className="w-3 h-3" /> {brl(m.receitas)}
                        </p>
                      )}
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${open === m.month ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {open === m.month && m.items.length > 0 && (
                  <div className="divide-y divide-slate-100 dark:divide-zinc-800 border-t border-slate-100 dark:border-zinc-800">
                    {m.items.map((it) => (
                      <div key={it.id} className="flex items-center gap-3 px-5 py-3">
                        <span className="text-lg">{CATEGORY_EMOJI[it.category] || '📦'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{it.description}</p>
                          <p className="text-xs text-slate-400 capitalize">{it.category}</p>
                        </div>
                        <p className={`text-sm font-bold ${it.type === 'receita' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {it.type === 'receita' ? '+' : '-'}{brl(it.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
