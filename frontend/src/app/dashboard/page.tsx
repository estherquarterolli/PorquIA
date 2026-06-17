'use client';

import { useEffect, useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useSummary, useBudgets, useTransactions } from '@/lib/hooks';
import { api, MonthlyData } from '@/lib/api';
import { BalanceHero } from '@/components/dashboard/BalanceHero';
import { StatCard } from '@/components/dashboard/StatCard';
import { IncomeExpenseChart } from '@/components/dashboard/IncomeExpenseChart';
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown';
import { BudgetsOverview } from '@/components/dashboard/BudgetsOverview';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { TelegramSetup } from '@/components/dashboard/TelegramSetup';
import { fmtBRL } from '@/lib/mock';

export default function DashboardPage() {
  const { user } = useAuth();
  const { summary, loading: loadingSummary, fetchSummary } = useSummary();
  const { budgets, fetchBudgets } = useBudgets();
  const { transactions, fetchTransactions } = useTransactions();
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [budgetStatus, setBudgetStatus] = useState<any[]>([]);

  useEffect(() => {
    fetchSummary();
    fetchBudgets();
    fetchTransactions();
    api.getMonthlyData(6).then(setMonthlyData).catch(() => {});
    api.getBudgetStatus().then(setBudgetStatus).catch(() => {});
  }, [fetchSummary, fetchBudgets, fetchTransactions]);

  const firstName = (user?.displayName || user?.email?.split('@')[0] || 'por aí').split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  const getTrend = (current: number, previous: number) => {
    if (!previous) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const trends = {
    receitas: monthlyData.length >= 2 ? getTrend(monthlyData[0]?.receitas || 0, monthlyData[1]?.receitas || 0) : 0,
    despesas: monthlyData.length >= 2 ? -getTrend(monthlyData[0]?.despesas || 0, monthlyData[1]?.despesas || 0) : 0,
    saldo: summary ? getTrend(summary.saldo, (monthlyData[1]?.receitas || 0) - (monthlyData[1]?.despesas || 0)) : 0,
  };

  const sparkData = (v: number) => [
    { value: v * 0.6 }, { value: v * 0.75 }, { value: v * 0.65 },
    { value: v * 0.9 }, { value: v * 0.85 }, { value: v * 0.95 },
    { value: v * 0.88 }, { value: v },
  ];

  if (loadingSummary) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full border-[3px] border-brand-500/25 border-t-brand-500 animate-spin" />
      </div>
    );
  }

  const saldo = summary?.saldo ?? 0;
  const receitas = summary?.totalReceitas ?? 0;
  const despesas = summary?.totalDespesas ?? 0;
  const taxaPoupanca = receitas ? Math.round(((receitas - despesas) / receitas) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Banner Telegram Setup */}
      <TelegramSetup />

      <div className="animate-fade-in-up">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
          {greeting}, <span className="gradient-text">{firstName}</span> 👋
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Aqui está o resumo das suas finanças.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 stagger">
        <div className="lg:col-span-4 lg:row-span-2 min-h-[340px]">
          <BalanceHero data={summary ?? undefined} trend={trends.saldo} sparkData={sparkData(saldo)} />
        </div>

        <div className="lg:col-span-4">
          <StatCard label="Receitas do mês" value={fmtBRL(receitas)} trend={trends.receitas} data={sparkData(receitas)} color="#10b981" Icon={TrendingUp} />
        </div>
        <div className="lg:col-span-4">
          <StatCard label="Despesas do mês" value={fmtBRL(despesas)} trend={trends.despesas} positiveIsGood={false} data={sparkData(despesas)} color="#f43f5e" Icon={TrendingDown} />
        </div>
        <div className="lg:col-span-4">
          <StatCard label="Taxa de poupança" value={`${taxaPoupanca}%`} data={sparkData(taxaPoupanca)} color="#a855f7" Icon={PiggyBank} />
        </div>
        <div className="lg:col-span-4">
          <StatCard label="Saldo do mês" value={fmtBRL(saldo)} trend={trends.saldo} data={sparkData(saldo)} color="#3b82f6" Icon={Wallet} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 stagger">
        <div className="lg:col-span-8 min-h-[360px]">
          <IncomeExpenseChart data={monthlyData} />
        </div>
        <div className="lg:col-span-4">
          <CategoryBreakdown data={summary ?? undefined} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 stagger">
        <div className="lg:col-span-5">
          <BudgetsOverview data={budgetStatus} />
        </div>
        <div className="lg:col-span-7">
          <RecentTransactions data={transactions} />
        </div>
      </div>
    </div>
  );
}
