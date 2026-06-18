'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { api, BudgetStatus } from '@/lib/api';

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState<BudgetStatus[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api
      .getBudgetStatus()
      .then((list) => setAlerts(list.filter((b) => b.status !== 'ok')))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const count = alerts.length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
        title="Notificações"
      >
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-full ring-2 ring-gray-50 dark:ring-zinc-950">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-2xl overflow-hidden z-50 animate-fade-in-up">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Notificações</p>
          </div>

          {count === 0 ? (
            <div className="px-4 py-8 text-center">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Tudo em dia! Nenhum alerta.</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800">
              {alerts.map((b) => (
                <div key={b.id} className="flex items-start gap-3 px-4 py-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      b.status === 'over'
                        ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-500'
                        : 'bg-amber-100 dark:bg-amber-950/40 text-amber-500'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
                      {b.category} {b.status === 'over' ? 'estourou' : 'perto do limite'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {brl(b.spent)} de {brl(b.monthly_limit)} ({b.percent}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
