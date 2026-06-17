'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { fmtBRL, mockTransactions, categoryMeta } from '@/lib/mock';
import type { Transaction } from '@/lib/api';

interface RecentTransactionsProps {
  data?: Transaction[];
}

export function RecentTransactions({ data = mockTransactions }: RecentTransactionsProps) {
  function relativeDay(iso: string) {
    const diff = Math.round((Date.now() - new Date(iso).getTime()) / 86400000);
    if (diff <= 0) return 'Hoje';
    if (diff === 1) return 'Ontem';
    if (diff < 7) return `${diff} dias atrás`;
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }
  return (
    <div className="card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 dark:text-white">Últimas transações</h3>
        <Link href="/transactions" className="flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-300 hover:gap-1.5 transition-all">
          Ver todas <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="-mx-2">
        {data.slice(0, 6).map((tx) => {
          const meta = categoryMeta(tx.category);
          const receita = tx.type === 'receita';
          return (
            <div key={tx.id} className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-brand-50/60 dark:hover:bg-white/5 transition-colors">
              <span
                className="w-10 h-10 rounded-xl grid place-items-center text-lg shrink-0"
                style={{ backgroundColor: `${meta.color}1f` }}
              >
                {meta.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{tx.description}</p>
                <p className="text-xs text-slate-400">{relativeDay(tx.date)} · {tx.payment_method}</p>
              </div>
              <span className={`text-sm font-bold tabular-nums shrink-0 ${receita ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}`}>
                {receita ? '+' : '−'}{fmtBRL(tx.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
