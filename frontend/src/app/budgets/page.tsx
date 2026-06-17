'use client';

import { useEffect, useState } from 'react';
import { useBudgets } from '@/lib/hooks';
import { api, BudgetStatus } from '@/lib/api';
import { fmtBRL, categoryMeta } from '@/lib/mock';
import { Trash2, Edit2, AlertCircle, Check, X, Plus } from 'lucide-react';

const CATEGORIES = [
  'alimentação','transporte','moradia','saúde','lazer',
  'educação','vestuário','serviços','investimento','outros',
];

function StatusBadge({ status }: { status: BudgetStatus['status'] }) {
  const map = {
    ok: { c: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400', t: 'No limite' },
    warning: { c: 'bg-amber-500/12 text-amber-600 dark:text-amber-400', t: 'Atenção' },
    over: { c: 'bg-rose-500/12 text-rose-600 dark:text-rose-400', t: 'Estourado' },
  }[status];
  return <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${map.c}`}>{map.t}</span>;
}

const BAR: Record<string, string> = { ok: 'bg-emerald-500', warning: 'bg-amber-500', over: 'bg-rose-500' };

export default function BudgetsPage() {
  const { budgets, fetchBudgets, create, update, remove } = useBudgets();
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus[]>([]);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  useEffect(() => { fetchBudgets(); loadStatus(); }, [fetchBudgets]);

  async function loadStatus() {
    api.getBudgetStatus().then(setBudgetStatus).catch(() => {});
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

  async function handleRemove(id: string) {
    if (!confirm('Remover orçamento?')) return;
    await remove(id).catch(() => {});
    loadStatus();
  }

  const usedCategories = new Set(budgets.map((b) => b.category));
  const availableCategories = CATEGORIES.filter((c) => !usedCategories.has(c));
  const alerts = budgetStatus.filter((b) => b.status !== 'ok');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">Orçamentos</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 capitalize">{new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Alertas */}
      {alerts.length > 0 && (
        <div className="space-y-2.5">
          {alerts.map(b => (
            <div key={b.id} className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${
              b.status === 'over'
                ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400'
                : 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400'
            }`}>
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">
                <strong className="capitalize">{categoryMeta(b.category).label}</strong> — {fmtBRL(b.spent)} de {fmtBRL(b.monthly_limit)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Novo orçamento</h3>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="field sm:flex-1" disabled={isSubmitting || availableCategories.length === 0}>
            <option value="">Categoria…</option>
            {availableCategories.map((cat) => (<option key={cat} value={cat}>{categoryMeta(cat).label}</option>))}
          </select>
          <input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="Limite (R$)" step="0.01" min="0" className="field sm:w-40" disabled={isSubmitting} />
          <button type="submit" disabled={isSubmitting || !category || !limit} className="btn-primary shrink-0">
            <Plus className="w-4 h-4" strokeWidth={2.6} /> Adicionar
          </button>
        </form>
        {submitError && <p className="text-rose-600 dark:text-rose-400 text-xs mt-3">{submitError}</p>}
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {budgetStatus.length === 0 ? (
          <div className="card py-16 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl brand-gradient-soft grid place-items-center text-2xl mb-3">🎯</div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Nenhum orçamento definido ainda</p>
          </div>
        ) : (
          budgetStatus.map((b) => {
            const meta = categoryMeta(b.category);
            return (
              <div key={b.id} className="card card-hover p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-xl grid place-items-center text-lg shrink-0" style={{ backgroundColor: `${meta.color}1f` }}>{meta.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white">{meta.label}</h4>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{fmtBRL(b.spent)} de {fmtBRL(b.monthly_limit)} · {b.percent}%</p>
                  </div>
                  <button onClick={() => { setEditingId(editingId === b.id ? null : b.id); setEditingValue(b.monthly_limit.toString()); }} className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-white/5 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleRemove(b.id)} className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-2.5 rounded-full bg-slate-200/70 dark:bg-white/8 overflow-hidden">
                  <div className={`h-full rounded-full ${BAR[b.status]} transition-all`} style={{ width: `${Math.min(b.percent, 100)}%` }} />
                </div>
                {editingId === b.id && (
                  <div className="flex gap-2 pt-4 mt-4 border-t border-slate-200/60 dark:border-white/5">
                    <input type="number" value={editingValue} onChange={(e) => setEditingValue(e.target.value)} className="field flex-1" placeholder="Novo limite" />
                    <button onClick={() => handleUpdate(b.id)} className="px-3 rounded-xl bg-emerald-500 text-white grid place-items-center"><Check className="w-4 h-4" /></button>
                    <button onClick={() => setEditingId(null)} className="px-3 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 grid place-items-center"><X className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
