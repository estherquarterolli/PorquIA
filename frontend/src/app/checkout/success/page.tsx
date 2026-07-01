'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { CheckCircle2, Loader2 } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const attempts = useRef(0);

  // Faz polling do status (o webhook pode levar alguns segundos)
  useEffect(() => {
    if (loading || !user) return;
    let active = true;

    const poll = async () => {
      try {
        const s = await api.verifyPayment();
        if (!active) return;
        if (s.active) {
          setConfirmed(true);
          setTimeout(() => router.replace('/dashboard'), 1500);
          return;
        }
      } catch {
        // ignora e tenta de novo
      }
      attempts.current += 1;
      if (attempts.current >= 10) {
        if (active) setTimedOut(true);
        return;
      }
      if (active) setTimeout(poll, 3000);
    };

    poll();
    return () => { active = false; };
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 px-6 transition-colors duration-300">
      <div className="glass-panel rounded-3xl p-10 max-w-md w-full text-center animate-fade-in-up">
        {confirmed ? (
          <>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-9 h-9 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pagamento confirmado!</h1>
            <p className="text-slate-600 dark:text-slate-400">Bem-vindo ao PorquIA. Redirecionando para o seu dashboard...</p>
          </>
        ) : timedOut ? (
          <>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center mb-6">
              <Loader2 className="w-9 h-9 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Quase lá...</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Ainda estamos confirmando seu pagamento. Pagamentos via PIX podem levar alguns instantes.
            </p>
            <button
              onClick={() => router.replace('/paywall')}
              className="px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-500/30 transition-all active:scale-[0.98]"
            >
              Voltar e verificar
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-950/40 flex items-center justify-center mb-6">
              <Loader2 className="w-9 h-9 text-fuchsia-600 dark:text-fuchsia-400 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verificando pagamento...</h1>
            <p className="text-slate-600 dark:text-slate-400">Só um instante enquanto confirmamos sua assinatura.</p>
          </>
        )}
      </div>
    </div>
  );
}
