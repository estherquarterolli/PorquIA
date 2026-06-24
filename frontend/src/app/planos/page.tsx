'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api, BillingStatus } from '@/lib/api';
import { Check, Sparkles, Zap, ExternalLink } from 'lucide-react';

const FREE_FEATURES = [
  'Registro de transações',
  'Categorias automáticas via IA',
  'Orçamentos mensais',
  'Bot Telegram',
  'Importar extrato OFX/CSV',
];

const PRO_FEATURES = [
  'Tudo do plano Gratuito',
  'Insights avançados com IA',
  'Investimentos & patrimônio',
  'Previsão de gastos futuros',
  'Detecção de assinaturas',
  'Integração bancária',
  'Suporte prioritário',
];

function brl(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

export default function PlanosPage() {
  const [billing, setBilling] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const searchParams = useSearchParams();
  const success = searchParams.get('sucesso') === 'true';

  useEffect(() => {
    api.getBillingStatus()
      .then(setBilling)
      .catch(() => setBilling({ plan: 'free', status: 'inactive', current_period_end: null }))
      .finally(() => setLoading(false));
  }, []);

  async function handleCheckout() {
    setActionLoading(true);
    try {
      const { url } = await api.createCheckoutSession();
      window.location.href = url;
    } catch {
      alert('Erro ao abrir pagamento. Tente novamente.');
      setActionLoading(false);
    }
  }

  async function handlePortal() {
    setActionLoading(true);
    try {
      const { url } = await api.openBillingPortal();
      window.location.href = url;
    } catch {
      alert('Erro ao abrir portal. Tente novamente.');
      setActionLoading(false);
    }
  }

  const isPro = billing?.plan === 'pro' && billing?.status === 'active';

  return (
    <div className="py-2">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200/50 dark:border-slate-700/50 pb-5">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-1">Planos</h1>
          <p className="text-slate-600 dark:text-slate-400 text-base">Escolha o plano ideal para sua vida financeira</p>
        </div>

        {/* Banner de sucesso */}
        {success && (
          <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-5 text-white shadow-lg shadow-emerald-500/20">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-bold text-lg">Bem-vindo ao Pro!</p>
                <p className="text-white/80 text-sm">Sua assinatura está ativa. Aproveite todos os recursos.</p>
              </div>
            </div>
          </div>
        )}

        {/* Status atual */}
        {!loading && billing && (
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-5 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">PLANO ATUAL</p>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${isPro ? 'text-fuchsia-600 dark:text-fuchsia-400' : 'text-slate-900 dark:text-white'}`}>
                  {isPro ? 'Pro' : 'Gratuito'}
                </span>
                {isPro && <Zap className="w-4 h-4 text-fuchsia-500" fill="currentColor" />}
              </div>
              {isPro && billing.current_period_end && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Renova em {new Date(billing.current_period_end).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
            {isPro && (
              <button
                onClick={handlePortal}
                disabled={actionLoading}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors disabled:opacity-50"
              >
                <ExternalLink className="w-4 h-4" />
                Gerenciar assinatura
              </button>
            )}
          </div>
        )}

        {/* Planos */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Gratuito */}
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-7 border border-slate-200/50 dark:border-slate-700/50 shadow-sm flex flex-col">
            <div className="mb-6">
              <p className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 mb-2">GRATUITO</p>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">R$0</span>
                <span className="text-slate-400 dark:text-slate-500 mb-1">/mês</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Para começar a organizar suas finanças.</p>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <Check className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <div className={`text-center py-2.5 rounded-xl text-sm font-semibold border ${
              !isPro
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-transparent'
                : 'border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500'
            }`}>
              {!isPro ? 'Plano atual' : 'Incluído'}
            </div>
          </div>

          {/* Pro */}
          <div className="relative bg-gradient-to-br from-fuchsia-600 via-pink-600 to-rose-500 rounded-2xl p-7 shadow-xl shadow-pink-600/30 flex flex-col overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-12 -translate-x-12" />

            <div className="relative mb-6">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-bold tracking-widest text-white/70">PRO</p>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">POPULAR</span>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold text-white">{brl(19.9)}</span>
                <span className="text-white/60 mb-1">/mês</span>
              </div>
              <p className="text-sm text-white/70 mt-2">Controle financeiro completo com IA.</p>
            </div>

            <ul className="relative space-y-3 flex-1 mb-8">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-white/90">
                  <Check className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="relative">
              {isPro ? (
                <button
                  onClick={handlePortal}
                  disabled={actionLoading}
                  className="w-full py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Gerenciar assinatura
                </button>
              ) : (
                <button
                  onClick={handleCheckout}
                  disabled={actionLoading || loading}
                  className="w-full py-3 rounded-xl bg-white text-fuchsia-700 font-bold text-sm hover:bg-white/90 transition-colors disabled:opacity-50 shadow-lg"
                >
                  {actionLoading ? 'Redirecionando...' : 'Assinar Pro'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* FAQ rápido */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 space-y-4">
          <h2 className="font-bold text-slate-900 dark:text-white text-base">Dúvidas frequentes</h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-200">Posso cancelar a qualquer momento?</p>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">Sim. O cancelamento é imediato pelo portal do Stripe e você mantém o acesso até o fim do período pago.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-200">Quais formas de pagamento são aceitas?</p>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">Cartão de crédito/débito via Stripe. Seguro e criptografado.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-200">Meus dados ficam seguros?</p>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">Os dados de pagamento são processados pelo Stripe e nunca passam pelo nosso servidor.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
