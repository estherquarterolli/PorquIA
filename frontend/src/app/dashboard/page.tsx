'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Send,
  Zap,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Wallet,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useProfile } from '@/lib/profile-context';
import { useSummary } from '@/lib/hooks';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const monthLabel = () =>
  new Date()
    .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    .replace(/^\w/, (c) => c.toUpperCase());

export default function DashboardPage() {
  const { user } = useAuth();
  const { telegramConnected } = useProfile();
  const { summary, fetch } = useSummary();
  const [dismissed, setDismissed] = useState(false);
  const showBanner = !telegramConnected && !dismissed;

  useEffect(() => {
    fetch();
  }, [fetch]);

  const firstName = user?.displayName?.split(' ')[0] || '';
  const receitas = summary?.totalReceitas ?? 0;
  const despesas = summary?.totalDespesas ?? 0;
  const saldo = summary?.saldo ?? 0;
  const poupanca = receitas > 0 ? Math.round(((receitas - despesas) / receitas) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Telegram banner */}
      {showBanner && (
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500 text-white shadow-xl shadow-pink-500/30">
          <Zap className="absolute top-6 right-6 w-6 h-6 text-white/70" />
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold">Conecte ao Telegram!</h3>
              <p className="text-white/80 text-sm">Registre gastos por mensagens em 30 segundos</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white/10 backdrop-blur p-4 sm:p-5 space-y-3">
            {[
              ['Abra o Telegram', 'Procure por @PorquIABot'],
              ['Mande /start', 'O bot vai responder com seu Chat ID'],
              ['Cole o Chat ID aqui', 'Clique em "Conectar agora" abaixo'],
            ].map(([t, d], i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold">{t}</p>
                  <p className="text-xs text-white/70">{d}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/70 font-medium">✓ Fácil · ✓ Rápido · ✓ Inteligente</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDismissed(true)}
                className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-sm font-semibold transition-colors"
              >
                Depois
              </button>
              <Link
                href="/settings"
                className="px-5 py-2.5 rounded-xl bg-white text-pink-600 hover:bg-white/90 text-sm font-bold flex items-center gap-2 transition-colors"
              >
                <Zap className="w-4 h-4" /> Conectar Agora <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          {greeting()},{' '}
          <span className="bg-gradient-to-r from-fuchsia-600 to-pink-600 dark:from-fuchsia-400 dark:to-pink-400 bg-clip-text text-transparent">
            {firstName}
          </span>{' '}
          👋
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Aqui está o resumo das suas finanças
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Saldo — destaque */}
        <div className="sm:col-span-2 lg:col-span-1 lg:row-span-2 rounded-3xl p-6 bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-xl shadow-purple-500/30 flex flex-col">
          <p className="text-white/70 text-sm font-medium">Saldo do mês</p>
          <p className="text-white/60 text-xs mb-4">{monthLabel()}</p>
          <p className="text-4xl font-bold tracking-tight">{brl(saldo)}</p>
          <div className="mt-auto pt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/10 backdrop-blur p-3">
              <p className="text-xs text-white/70 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Receitas
              </p>
              <p className="text-sm font-bold mt-1">{brl(receitas)}</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur p-3">
              <p className="text-xs text-white/70 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" /> Despesas
              </p>
              <p className="text-sm font-bold mt-1">{brl(despesas)}</p>
            </div>
          </div>
        </div>

        <StatCard
          title="Receitas do mês"
          value={brl(receitas)}
          Icon={TrendingUp}
          tint="emerald"
        />
        <StatCard
          title="Despesas do mês"
          value={brl(despesas)}
          Icon={TrendingDown}
          tint="rose"
        />
        <StatCard
          title="Taxa de poupança"
          value={`${poupanca}%`}
          Icon={PiggyBank}
          tint="fuchsia"
        />
        <StatCard
          title="Saldo do mês"
          value={brl(saldo)}
          Icon={Wallet}
          tint="violet"
        />
      </div>

      {/* Gráficos */}
      <DashboardCharts porCategoria={summary?.porCategoria ?? {}} />
    </div>
  );
}

const TINTS: Record<string, string> = {
  emerald: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
  rose: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40',
  fuchsia: 'text-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-950/40',
  violet: 'text-violet-500 bg-violet-50 dark:bg-violet-950/40',
};

function StatCard({
  title,
  value,
  Icon,
  tint,
}: {
  title: string;
  value: string;
  Icon: React.ComponentType<{ className?: string }>;
  tint: string;
}) {
  return (
    <div className="rounded-3xl p-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${TINTS[tint]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">{title}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
    </div>
  );
}
