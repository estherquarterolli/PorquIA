'use client';

import { useState, useEffect } from 'react';
import { X, FlaskConical, AlertTriangle } from 'lucide-react';

const STORAGE_KEY = 'porquia_beta_dismissed_at';
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export function BetaNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const dismissedAt = parseInt(raw, 10);
      if (Date.now() - dismissedAt < DISMISS_DURATION_MS) return;
    }
    setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500" />

        <button
          onClick={dismiss}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Fechar aviso"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 pt-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
              <FlaskConical className="w-3.5 h-3.5" />
              Período de Teste
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Bem-vindo ao PorquIA Beta! 🚀
          </h2>

          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p>
                Você está usando uma versão em{' '}
                <strong className="text-slate-700 dark:text-slate-300">período de testes</strong>.
                Funcionalidades podem mudar ou apresentar instabilidades.
              </p>
            </div>
            <div className="flex gap-2.5">
              <span className="text-base shrink-0 leading-none mt-0.5">💾</span>
              <p>
                Seus dados são salvos, mas recomendamos{' '}
                <strong className="text-slate-700 dark:text-slate-300">não depender exclusivamente</strong>{' '}
                da plataforma por enquanto.
              </p>
            </div>
            <div className="flex gap-2.5">
              <span className="text-base shrink-0 leading-none mt-0.5">💬</span>
              <p>
                Encontrou um bug ou tem sugestões? Fale conosco pelo <strong className="text-slate-700 dark:text-slate-300">Telegram</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={dismiss}
            className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Entendido, vamos lá!
          </button>
        </div>
      </div>
    </div>
  );
}
