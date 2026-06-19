'use client';

import { useEffect, useState } from 'react';
import { api, Summary, MonthlyData } from '@/lib/api';
import { Lightbulb, TrendingUp, TrendingDown, PiggyBank, Trophy } from 'lucide-react';

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

type Insight = {
  Icon: React.ComponentType<{ className?: string }>;
  tone: 'good' | 'bad' | 'neutral';
  text: React.ReactNode;
};

const TONES = {
  good: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
  bad: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40',
  neutral: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
};

function buildInsights(summary: Summary, monthly: MonthlyData[]): Insight[] {
  const out: Insight[] = [];

  // 1. Maior categoria de gasto
  const cats = Object.entries(summary.porCategoria || {});
  if (cats.length > 0) {
    const [cat, val] = cats.sort((a, b) => b[1] - a[1])[0];
    const pct = summary.totalDespesas > 0 ? Math.round((val / summary.totalDespesas) * 100) : 0;
    out.push({
      Icon: Trophy,
      tone: 'neutral',
      text: (
        <>
          Sua maior despesa é <strong className="capitalize">{cat}</strong>: {brl(val)} ({pct}% do total).
        </>
      ),
    });
  }

  // 2. Variação vs mês anterior
  if (monthly.length >= 2) {
    const atual = monthly[monthly.length - 1].despesas;
    const anterior = monthly[monthly.length - 2].despesas;
    if (anterior > 0) {
      const diff = Math.round(((atual - anterior) / anterior) * 100);
      if (diff > 5) {
        out.push({
          Icon: TrendingUp,
          tone: 'bad',
          text: <>Você gastou <strong>{diff}% a mais</strong> que no mês passado.</>,
        });
      } else if (diff < -5) {
        out.push({
          Icon: TrendingDown,
          tone: 'good',
          text: <>Você gastou <strong>{Math.abs(diff)}% a menos</strong> que no mês passado. Mandou bem! 🎉</>,
        });
      } else {
        out.push({
          Icon: TrendingDown,
          tone: 'neutral',
          text: <>Seus gastos estão estáveis em relação ao mês passado.</>,
        });
      }
    }
  }

  // 3. Taxa de poupança
  if (summary.totalReceitas > 0) {
    const taxa = Math.round(((summary.totalReceitas - summary.totalDespesas) / summary.totalReceitas) * 100);
    if (taxa >= 20) {
      out.push({
        Icon: PiggyBank,
        tone: 'good',
        text: <>Excelente! Você está poupando <strong>{taxa}%</strong> da sua renda este mês.</>,
      });
    } else if (taxa >= 0) {
      out.push({
        Icon: PiggyBank,
        tone: 'neutral',
        text: <>Você está poupando <strong>{taxa}%</strong> da renda. Que tal mirar em 20%?</>,
      });
    } else {
      out.push({
        Icon: TrendingDown,
        tone: 'bad',
        text: <>Atenção: suas despesas superaram as receitas este mês.</>,
      });
    }
  }

  return out;
}

export function InsightsCard({ summary }: { summary: Summary | null }) {
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);

  useEffect(() => {
    api.getMonthlyData(6).then(setMonthly).catch(() => {});
  }, []);

  if (!summary) return null;
  const insights = buildInsights(summary, monthly);
  if (insights.length === 0) return null;

  return (
    <div className="rounded-3xl p-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
          <Lightbulb className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Insights</h3>
      </div>
      <div className="space-y-3">
        {insights.map((it, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${TONES[it.tone]}`}>
              <it.Icon className="w-4 h-4" />
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 pt-1.5">{it.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
