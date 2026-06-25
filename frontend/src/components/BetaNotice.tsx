'use client';

import { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';

const FIRST_LOGIN_KEY = 'porquia_first_login_at';
const TRIAL_DAYS = 7;

function getDaysRemaining(): number {
  let firstLogin = localStorage.getItem(FIRST_LOGIN_KEY);
  if (!firstLogin) {
    firstLogin = Date.now().toString();
    localStorage.setItem(FIRST_LOGIN_KEY, firstLogin);
  }
  const elapsed = Date.now() - parseInt(firstLogin, 10);
  const elapsedDays = elapsed / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.ceil(TRIAL_DAYS - elapsedDays));
}

export function BetaNotice() {
  const [visible, setVisible] = useState(false);
  const [daysLeft, setDaysLeft] = useState(TRIAL_DAYS);

  useEffect(() => {
    const days = getDaysRemaining();
    setDaysLeft(days);
    setVisible(true);
  }, []);

  if (!visible) return null;

  const isLastDay = daysLeft <= 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500" />

        <button
          onClick={() => setVisible(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 pt-5 flex flex-col items-center text-center">
          {/* Countdown circle */}
          <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center mb-5 ${
            isLastDay
              ? 'bg-rose-100 dark:bg-rose-900/30'
              : 'bg-fuchsia-50 dark:bg-fuchsia-900/20'
          }`}>
            <span className={`text-3xl font-black leading-none ${
              isLastDay ? 'text-rose-500' : 'text-fuchsia-600 dark:text-fuchsia-400'
            }`}>
              {daysLeft}
            </span>
            <span className={`text-[10px] font-semibold uppercase tracking-wide ${
              isLastDay ? 'text-rose-400' : 'text-fuchsia-400 dark:text-fuchsia-500'
            }`}>
              {daysLeft === 1 ? 'dia' : 'dias'}
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {isLastDay ? 'Último dia de teste!' : 'Período de Teste'}
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            {isLastDay
              ? 'Seu período de teste termina hoje. Assine um plano para continuar usando o PorquIA.'
              : `Seu período de teste termina em ${daysLeft} dias. Aproveite para explorar todas as funcionalidades!`
            }
          </p>

          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={() => setVisible(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Continuar explorando
            </button>
            {isLastDay && (
              <a
                href="/planos"
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-center"
              >
                Ver planos
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
