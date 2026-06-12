'use client';

import { useEffect, useState } from 'react';
import { useTransactions } from '@/lib/hooks';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default function TransactionsPage() {
  const { transactions, loading, error, fetch, create, remove } = useTransactions();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetch();
  }, [fetch]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await create(message);
      setMessage('');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro ao criar transação');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja deletar esta transação?')) return;

    try {
      setDeleteError(null);
      await remove(id);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erro ao deletar transação');
    }
  }

  return (
    <div className="flex-1 p-8 overflow-auto">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">Transações</h1>

      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-8">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
          Adicionar Transação
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
          Descreva sua transação de forma natural:
        </p>
        <p className="text-zinc-500 dark:text-zinc-500 text-xs mb-4">
          Exemplos: &quot;gastei 50 no mercado&quot;, &quot;paguei 1200 de aluguel no pix&quot;,
          &quot;recebi salário 5000&quot;
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite aqui..."
            className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          {submitError && <p className="text-red-600 dark:text-red-400 text-sm">{submitError}</p>}
          <button
            type="submit"
            disabled={isSubmitting || !message.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? 'Processando...' : 'Adicionar'}
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
          Lista de Transações
        </h2>

        {deleteError && <p className="text-red-600 dark:text-red-400 text-sm mb-4">{deleteError}</p>}

        {loading ? (
          <p className="text-zinc-500">Carregando transações...</p>
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-zinc-900 dark:text-white">
                    Data
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-zinc-900 dark:text-white">
                    Descrição
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-zinc-900 dark:text-white">
                    Categoria
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-zinc-900 dark:text-white">
                    Método
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-zinc-900 dark:text-white">
                    Valor
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-zinc-900 dark:text-white">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                      {new Date(tx.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 text-zinc-900 dark:text-white font-medium">
                      {tx.description}
                    </td>
                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                      {tx.category}
                    </td>
                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                      {tx.payment_method}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-semibold ${
                        tx.type === 'receita'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {tx.type === 'receita' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-zinc-500">Nenhuma transação registrada</p>
        )}
      </div>
    </div>
  );
}
