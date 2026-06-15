'use client';

import { useEffect, useState } from 'react';
import { useBudgets } from '@/lib/hooks';
import { api, BudgetStatus } from '@/lib/api';
import { Trash2, Edit2, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  'alimentação','transporte','moradia','saúde','lazer',
  'educação','vestuário','serviços','investimento','outros',
];

function brl(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

function StatusBadge({ status }: { status: BudgetStatus['status'] }) {
  const colors = {
    ok: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    over: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  };
  return <span className={`text-xs font-bold px-3 py-1 rounded-full ${colors[status]}`}>{status === 'ok' ? 'Ok' : status === 'warning' ? 'Atenção' : 'Estourado'}</span>;
}

export default function BudgetsPage() {
  const { budgets, loading, fetch, create, update, remove } = useBudgets();
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus[]>([]);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  useEffect(() => { fetch(); loadStatus(); }, [fetch]);

  async function loadStatus() {
    api.getBudgetStatus().then(setBudgetStatus);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category || !limit) return;
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await create(category, parseFloat(limit));
      setCategory(''); setLimit('');
      loadStatus();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro');
    } finally { setIsSubmitting(false); }
  }

  async function handleUpdate(id: string) {
    if (!editingValue) return;
    await update(id, parseFloat(editingValue));
    setEditingId(null); setEditingValue('');
    loadStatus();
  }

  const usedCategories = new Set(budgets.map((b) => b.category));
  const availableCategories = CATEGORIES.filter((c) => !usedCategories.has(c));
  const alerts = budgetStatus.filter((b) => b.status !== 'ok');

  return (
    <div className="min-h-screen px-6 lg:px-10 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200/50 dark:border-slate-700/50 pb-8">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-2">Orçamentos</h1>
          <p className="text-slate-600 dark:text-slate-400 text-base capitalize">{new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-3">
            {alerts.map(b => (
              <div key={b.id} className={`flex items-center gap-3 px-5 py-4 rounded-xl border-2 ${
                b.status === 'over'
                  ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
                  : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400'
              }`}>
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-semibold"><strong>{b.category}</strong>: {brl(b.spent)} de {brl(b.monthly_limit)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Form */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 shadow-sm dark:shadow-lg dark:shadow-black/20 border border-slate-200/50 dark:border-slate-700/50">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Adicionar Orçamento</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-3 border border-slate-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-700/30 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 backdrop-blur-sm"
                disabled={isSubmitting || availableCategories.length === 0}
              >
                <option value="">Categoria...</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
              <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="Limite (R$)"
                step="0.01" min="0"
                className="px-4 py-3 border border-slate-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-700/30 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 backdrop-blur-sm"
                disabled={isSubmitting}
              />
            </div>
            {submitError && <p className="text-red-600 dark:text-red-400 text-xs">{submitError}</p>}
            <button
              type="submit"
              disabled={isSubmitting || !category || !limit}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white disabled:text-slate-400 rounded-xl font-bold transition-all"
            >
              Adicionar
            </button>
          </form>
        </div>

        {/* List */}
        <div className="space-y-3">
          {budgetStatus.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm font-medium">Nenhum orçamento</p>
            </div>
          ) : (
            budgetStatus.map((b) => (
              <div key={b.id} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 shadow-sm dark:shadow-lg dark:shadow-black/20 border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white capitalize">{b.category}</h4>
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-3">
                      <span>{brl(b.spent)} gastos</span>
                      <span>{brl(b.monthly_limit)} ({b.percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          b.status === 'over' ? 'bg-red-500' : b.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(b.percent, 100)}%` }}
                      />
                    </div>
                  </div>
                  <button onClick={() => { setEditingId(b.id); setEditingValue(b.monthly_limit.toString()); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </button>
                </div>
                {editingId === b.id && (
                  <div className="flex gap-2 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                    <input type="number" value={editingValue} onChange={(e) => setEditingValue(e.target.value)} className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm" />
                    <button onClick={() => handleUpdate(b.id)} className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold">✓</button>
                    <button onClick={() => setEditingId(null)} className="px-3 py-2 bg-slate-300 dark:bg-slate-700 rounded-lg text-xs font-bold">✕</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
