'use client';

import { useEffect, useState } from 'react';
import { useBudgets } from '@/lib/hooks';

const CATEGORIES = [
  'alimentação',
  'transporte',
  'moradia',
  'saúde',
  'lazer',
  'educação',
  'vestuário',
  'serviços',
  'investimento',
  'outros',
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default function BudgetsPage() {
  const { budgets, loading, error, fetch, create, update, remove } = useBudgets();
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  useEffect(() => {
    fetch();
  }, [fetch]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category || !limit) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await create(category, parseFloat(limit));
      setCategory('');
      setLimit('');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro ao criar orçamento');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(id: string) {
    if (!editingValue) return;

    try {
      await update(id, parseFloat(editingValue));
      setEditingId(null);
      setEditingValue('');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro ao atualizar orçamento');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja deletar este orçamento?')) return;

    try {
      setSubmitError(null);
      await remove(id);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro ao deletar orçamento');
    }
  }

  const usedCategories = new Set(budgets.map((b) => b.category));
  const availableCategories = CATEGORIES.filter((c) => !usedCategories.has(c));

  return (
    <div className="flex-1 p-8 overflow-auto">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">Orçamentos</h1>

      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-8">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
          Adicionar Orçamento
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting || availableCategories.length === 0}
            >
              <option value="">Selecione uma categoria</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="Limite mensal (R$)"
              step="0.01"
              min="0"
              className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {submitError && <p className="text-red-600 dark:text-red-400 text-sm">{submitError}</p>}

          <button
            type="submit"
            disabled={isSubmitting || !category || !limit || availableCategories.length === 0}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? 'Adicionando...' : 'Adicionar Orçamento'}
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
          Seus Orçamentos
        </h2>

        {loading ? (
          <p className="text-zinc-500">Carregando orçamentos...</p>
        ) : budgets.length > 0 ? (
          <div className="space-y-4">
            {budgets.map((budget) => (
              <div
                key={budget.id}
                className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 group hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-zinc-900 dark:text-white">
                    {budget.category.charAt(0).toUpperCase() + budget.category.slice(1)}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    Limite: {formatCurrency(budget.monthly_limit)}
                  </p>
                </div>

                {editingId === budget.id ? (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      step="0.01"
                      min="0"
                      className="w-32 px-2 py-1 border border-zinc-300 dark:border-zinc-600 rounded text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleUpdate(budget.id)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white rounded text-sm font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingId(budget.id);
                        setEditingValue(budget.monthly_limit.toString());
                      }}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium"
                    >
                      Deletar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-500">
            {availableCategories.length === 0
              ? 'Você já configurou orçamentos para todas as categorias!'
              : 'Nenhum orçamento configurado. Crie um acima!'}
          </p>
        )}
      </div>
    </div>
  );
}
