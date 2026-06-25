'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import {
  Sparkles, MessageCircle, CreditCard, RefreshCw, BarChart3,
  FileText, Check, ArrowRight, Zap,
} from 'lucide-react';

const FEATURES = [
  { icon: Sparkles, title: 'IA que entende você', desc: 'Escreva "gastei 50 no mercado" e a IA registra tudo sozinha — categoria, valor e método.' },
  { icon: MessageCircle, title: 'Bot no Telegram', desc: 'Registre gastos direto pelo Telegram, de onde estiver, sem abrir o app.' },
  { icon: CreditCard, title: 'Parcelamentos automáticos', desc: 'Compras no crédito viram parcelas mensais lançadas automaticamente nos próximos meses.' },
  { icon: RefreshCw, title: 'Assinaturas detectadas', desc: 'Identificamos Netflix, Spotify e cobranças recorrentes para você não perder nada.' },
  { icon: BarChart3, title: 'Dashboard e gráficos', desc: 'Saldo, receitas, despesas e taxa de economia em gráficos lindos e claros.' },
  { icon: FileText, title: 'Importar extrato', desc: 'Suba o extrato do banco (OFX/CSV) e importe tudo sem digitar uma transação.' },
];

const PLAN_FEATURES = [
  'IA ilimitada para registrar gastos',
  'Bot do Telegram integrado',
  'Dashboard completo com gráficos',
  'Orçamentos, metas e alertas',
  'Detecção de assinaturas',
  'Importação de extrato bancário',
];

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Usuário logado → decide entre dashboard (ativo) e paywall (sem plano)
  useEffect(() => {
    if (loading || !user) return;
    api
      .getBillingStatus()
      .then((s) => router.replace(s.active ? '/dashboard' : '/paywall'))
      .catch(() => router.replace('/paywall'));
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500 animate-pulse shadow-lg shadow-pink-500/40" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 relative overflow-hidden transition-colors duration-300">
      {/* Mesh background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-fuchsia-500/20 dark:bg-fuchsia-600/20 rounded-full blur-[130px] animate-blob" />
        <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 dark:bg-blue-600/20 rounded-full blur-[130px] animate-blob" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-[-15%] left-[30%] w-[40%] h-[40%] bg-pink-500/20 dark:bg-pink-600/20 rounded-full blur-[130px] animate-blob" style={{ animationDelay: '6s' }} />
      </div>

      <div className="relative z-10">
        {/* Navbar */}
        <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-pink-500/30">
              P
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">PorquIA</span>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors"
          >
            Entrar
          </button>
        </header>

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-100 dark:bg-fuchsia-950/40 border border-fuchsia-200/60 dark:border-fuchsia-800/40 text-fuchsia-700 dark:text-fuchsia-300 text-xs font-semibold mb-6">
            <Zap className="w-3.5 h-3.5" />
            7 dias grátis · sem cartão para começar
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
            Controle suas finanças
            <br />
            <span className="bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent">com inteligência artificial</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            Registre gastos em linguagem natural, acompanhe assinaturas, parcelamentos e veja para onde seu dinheiro está indo — tudo em um só lugar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => router.push('/login')}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Começar grátis
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#planos"
              className="w-full sm:w-auto px-7 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-center"
            >
              Ver planos
            </a>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="glass-panel rounded-2xl p-6 hover:scale-[1.02] transition-transform"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-fuchsia-500/15 to-pink-500/15 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-fuchsia-600 dark:text-fuchsia-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="planos" className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">Escolha seu plano</h2>
            <p className="text-slate-600 dark:text-slate-400">Comece com 7 dias grátis. Cancele quando quiser.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                onClick={() => router.push('/login?plan=monthly')}
                className="w-full py-3.5 bg-white dark:bg-slate-800 border-2 border-fuchsia-500 text-fuchsia-600 dark:text-fuchsia-400 font-bold rounded-xl hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/30 transition-all active:scale-[0.98]"
              >
                Assinar Mensal
              </button>
            </div>

            {/* Anual */}
            <div className="relative rounded-3xl p-8 flex flex-col bg-gradient-to-br from-fuchsia-600 to-pink-600 text-white shadow-2xl shadow-pink-500/30">
              <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-bold">
                25% OFF
              </div>
              <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Anual</p>
              <div className="mt-3 mb-1 flex items-end gap-1">
                <span className="text-4xl font-bold">R$ 179,90</span>
                <span className="text-white/70 mb-1">/ano</span>
              </div>
              <p className="text-sm text-white/80 mb-6">
                <span className="line-through opacity-70">R$ 238,80</span> · equivale a R$ 14,99/mês
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
                onClick={() => router.push('/login?plan=annual')}
                className="w-full py-3.5 bg-white text-fuchsia-600 font-bold rounded-xl hover:bg-fuchsia-50 transition-all active:scale-[0.98] shadow-lg"
              >
                Melhor custo-benefício
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200/50 dark:border-slate-800/50 mt-12">
          <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">P</div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">PorquIA</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
              <a href="/terms" className="hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors">Termos de Serviço</a>
              <a href="mailto:contato@porquia.app" className="hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors">Contato</a>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">© {new Date().getFullYear()} PorquIA</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
