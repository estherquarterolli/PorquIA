'use client';

import Link from 'next/link';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { fmtBRL, mockSummary, mockSaldoSpark } from '@/lib/mock';
import type { Summary } from '@/lib/api';

interface BalanceHeroProps {
  data?: Summary;
  trend?: number;
  sparkData?: { value: number }[];
}

export function BalanceHero({ data = mockSummary, trend = 12.4, sparkData = mockSaldoSpark }: BalanceHeroProps) {
  const period = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 lg:p-7 h-full flex flex-col brand-gradient text-white shadow-[0_20px_50px_-18px_rgba(168,85,247,0.75)]">
      {/* brilhos decorativos */}
      <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-10 w-52 h-52 bg-fuchsia-400/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-white/70 text-sm font-medium">Saldo do mês</p>
          <p className="text-white/55 text-xs font-medium capitalize">{period}</p>
        </div>
        <span className="flex items-center gap-1 text-xs font-bold bg-white/20 backdrop-blur px-2.5 py-1 rounded-full">
          <ArrowUpRight className="w-3.5 h-3.5" /> {trend}%
        </span>
      </div>

      <h2 className="relative mt-3 text-4xl lg:text-5xl font-bold tracking-tight tabular-nums">
        {fmtBRL(data.saldo)}
      </h2>

      <div className="relative h-16 mt-3 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkData} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="heroSpark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fff" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#fff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke="#fff" strokeWidth={2.5} fill="url(#heroSpark)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="relative grid grid-cols-2 gap-3 mt-auto pt-4">
        <div className="bg-white/15 backdrop-blur rounded-2xl px-4 py-3">
          <div className="flex items-center gap-1.5 text-white/75 text-xs font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> Receitas
          </div>
          <p className="text-lg font-bold tabular-nums mt-0.5">{fmtBRL(data.totalReceitas)}</p>
        </div>
        <div className="bg-white/15 backdrop-blur rounded-2xl px-4 py-3">
          <div className="flex items-center gap-1.5 text-white/75 text-xs font-medium">
            <TrendingDown className="w-3.5 h-3.5" /> Despesas
          </div>
          <p className="text-lg font-bold tabular-nums mt-0.5">{fmtBRL(data.totalDespesas)}</p>
        </div>
      </div>

      <Link
        href="/transactions"
        className="relative mt-4 flex items-center justify-center gap-2 bg-white text-brand-700 font-semibold text-sm rounded-2xl py-3 hover:bg-white/90 transition-colors"
      >
        <Plus className="w-4 h-4" strokeWidth={2.6} /> Nova transação
      </Link>
    </div>
  );
}
