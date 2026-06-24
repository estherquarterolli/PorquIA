'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { fmtBRL, mockBudgets, categoryMeta } from '@/lib/mock';
import type { BudgetStatus } from '@/lib/api';

const BAR: Record<string, string> = {
  ok: 'bg-emerald-500',
  warning: 'bg-amber-500',
  over: 'bg-rose-500',
};
const TAG: Record<string, string> = {
  ok: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-600 dark:text-amber-400',
  over: 'text-rose-600 dark:text-rose-400',
};

interface BudgetsOverviewProps {
  data?: BudgetStatus[];
}

export function BudgetsOverview({ data = mockBudgets }: BudgetsOverviewProps) {
  return (
    <div className="card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">Orçamentos</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Acompanhamento do mês</p>
        </div>
        <Link href="/budgets" className="flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-300 hover:gap-1.5 transition-all">
          Ver tudo <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {data.slice(0, 4).map((b) => {
          const meta = categoryMeta(b.category);
          return (
            <div key={b.id}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <span>{meta.emoji}</span> {meta.label}
                </span>
                <span className="text-sm tabular-nums">
                  <span className="font-semibold text-slate-900 dark:text-white">{fmtBRL(b.spent)}</span>
                  <span className="text-slate-400"> / {fmtBRL(b.monthly_limit)}</span>
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-200/70 dark:bg-white/8 overflow-hidden">
                <div
                  className={`h-full rounded-full ${BAR[b.status]} transition-all`}
                  style={{ width: `${Math.min(b.percent, 100)}%` }}
                />
              </div>
              <div className="flex justify-end mt-1">
                <span className={`text-[11px] font-bold ${TAG[b.status]}`}>{b.percent}% usado</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
