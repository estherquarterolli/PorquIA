'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api, BillingStatus } from '@/lib/api';
import { Check, Sparkles, LogOut, RefreshCw, ArrowRight } from 'lucide-react';

const PLAN_FEATURES = [
  'IA ilimitada para registrar gastos',
  'Bot do Telegram integrado',
  'Dashboard completo com gráficos',
  'Detecção de assinaturas e parcelamentos',
  'Importação de extrato bancário',
];

export default function PaywallPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [checkingOut, setCheckingOut] = useState<'monthly' | 'annual' | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega status; se já estiver ativo, manda pro dashboard
  useEffect(() => {
    if (loading || !user) return;
    api
      .getBillingStatus()
      .then((s) => {
        if (s.active) router.replace('/dashboard');
        else setStatus(s);
      })
      .catch(() => setStatus(null));
  }, [user, loading, router]);

  async function handleSubscribe(plan: 'monthly' | 'annual') {
    setCheckingOut(plan);
    setError(null);
    try {
      const { payment_url } = await api.createCheckout(plan);
      window.location.href = payment_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao iniciar pagamento');
      setCheckingOut(null);
    }
  }

  async function handleVerify() {
    setVerifying(true);
    setError(null);
    try {
      const s = await api.verifyPayment();
      if (s.active) router.replace('/dashboard');
      else setError('Ainda não identificamos seu pagamento. Se você acabou de pagar via PIX, aguarde alguns instantes e tente novamente.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao verificar pagamento');
    } finally {
      setVerifying(false);
    }
  }

  const trialExpired = status?.plan === 'trial' || status?.plan === 'inactive';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 relative overflow-hidden transition-colors duration-300">
      {/* Mesh background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-fuchsia-500/20 dark:bg-fuchsia-600/20 rounded-full blur-[130px] animate-blob" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 dark:bg-blue-600/20 rounded-full blur-[130px] animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold">P</div>
            <span className="font-bold text-slate-900 dark:text-white">PorquIA</span>
          </div>
          <button
            onClick={() => logout().then(() => router.replace('/'))}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          {trialExpired && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              Seu período de teste terminou
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            {user?.displayName ? `${user.displayName.split(' ')[0]}, ` : ''}continue no controle 💸
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Assine para manter acesso à IA, ao bot do Telegram e a todos os seus dados financeiros.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Mensal */}
          <div className="glass-panel rounded-3xl p-8 flex flex-col">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Mensal</p>
            <div className="mt-3 mb-1 flex items-end gap-1">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">R$ 19,90</span>
              <span className="text-slate-500 dark:text-slate-400 mb-1">/mês</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Flexível, sem compromisso.</p>
            <ul className="space-y-3 mb-8 flex-1">
              {PLAN_FEATURES.map((feat) => (
                <li key={feat} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-fuchsia-600 dark:text-fuchsia-400 mt-0.5 flex-shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe('monthly')}
              disabled={checkingOut !== null}
              className="w-full py-3.5 bg-white dark:bg-slate-800 border-2 border-fuchsia-500 text-fuchsia-600 dark:text-fuchsia-400 font-bold rounded-xl hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/30 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {checkingOut === 'monthly' ? 'Gerando pagamento...' : 'Assinar mensal'}
            </button>
          </div>

          {/* Anual */}
          <div className="relative rounded-3xl p-8 flex flex-col bg-gradient-to-br from-fuchsia-600 to-pink-600 text-white shadow-2xl shadow-pink-500/30">
            <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-bold">25% OFF</div>
            <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Anual</p>
            <div className="mt-3 mb-1 flex items-end gap-1">
              <span className="text-4xl font-bold">R$ 179,90</span>
              <span className="text-white/70 mb-1">/ano</span>
            </div>
            <p className="text-sm text-white/80 mb-6">
              <span className="line-through opacity-70">R$ 238,80</span> · R$ 14,99/mês
            </p>
            <ul className="space-y-3 mb-8 flex-1">
              {PLAN_FEATURES.map((feat) => (
                <li key={feat} className="flex items-start gap-2.5 text-sm text-white/95">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe('annual')}
              disabled={checkingOut !== null}
              className="w-full py-3.5 bg-white text-fuchsia-600 font-bold rounded-xl hover:bg-fuchsia-50 transition-all active:scale-[0.98] shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {checkingOut === 'annual' ? 'Gerando pagamento...' : (<>Assinar anual <ArrowRight className="w-4 h-4" /></>)}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-center text-sm text-rose-500 dark:text-rose-400 mb-4 max-w-lg mx-auto">{error}</p>
        )}

        {/* Já paguei */}
        <div className="text-center">
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${verifying ? 'animate-spin' : ''}`} />
            {verifying ? 'Verificando...' : 'Já paguei? Verificar pagamento'}
          </button>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
            Pagamento via PIX, processado pelo Abacate Pay. Cancele quando quiser.
          </p>
        </div>
      </div>
    </div>
  );
}
