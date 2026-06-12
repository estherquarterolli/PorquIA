'use client';

import { useEffect } from 'react';
import { useSummary, useTransactions } from '@/lib/hooks';
import { CategoriesChart } from '@/components/Charts';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default function DashboardPage() {
  const { summary, loading: summaryLoading, fetch: fetchSummary } = useSummary();
  const { transactions, loading: transactionsLoading, fetch: fetchTransactions } = useTransactions();

  useEffect(() => {
    fetchSummary();
    fetchTransactions();
  }, [fetchSummary, fetchTransactions]);

  return (
    <div className="flex-1 p-8 overflow-auto">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">
        Dashboard Financeiro
      </h1>

      {summaryLoading ? (
        <p className="text-zinc-500">Carregando resumo...</p>
      ) : summary ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium mb-1">
              Total de Despesas
            </p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(summary.totalDespesas)}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium mb-1">
              Total de Receitas
            </p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(summary.totalReceitas)}
            </p>
          </div>

          <div className={`bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm border border-zinc-200 dark:border-zinc-800`}>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium mb-1">Saldo</p>
            <p
              className={`text-3xl font-bold ${
                summary.saldo >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {formatCurrency(summary.saldo)}
            </p>
          </div>
        </div>
      ) : null}

      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-8">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
          Despesas por Categoria
        </h2>
        {summary && Object.keys(summary.porCategoria).length > 0 ? (
          <CategoriesChart data={summary.porCategoria} />
        ) : (
          <p className="text-zinc-500 text-center py-8">Nenhuma despesa registrada este mês</p>
        )}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
          Últimas Transações
        </h2>
        {transactionsLoading ? (
          <p className="text-zinc-500">Carregando transações...</p>
        ) : transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3 border-b border-zinc-200 dark:border-zinc-800 last:border-b-0"
              >
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">
                    {tx.description}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {tx.category} • {new Date(tx.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <p
                  className={`text-lg font-semibold ${
                    tx.type === 'receita'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {tx.type === 'receita' ? '+' : '-'}
                  {formatCurrency(tx.amount)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-500">Nenhuma transação registrada</p>
        )}
      </div>
    </div>
  );
}
