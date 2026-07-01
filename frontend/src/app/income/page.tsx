'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTransactions } from '@/lib/hooks';
import { api, Transaction } from '@/lib/api';
import { INCOME_CATEGORIES, getAllCategories } from '@/lib/categories';
import { TrendingUp, Pencil, Trash2, X, Plus, Check } from 'lucide-react';

function brl(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

function monthLabel(key: string) {
  const [y, m] = key.split('-').map(Number);
  const label = new Date(y, m - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function currentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function buildMonthOptions() {
  const options = [];
  const now = new Date();
  for (let i = 0; i <= 11; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    options.push({ value: key, label: monthLabel(key) });
  }
  return options;
}

const PAYMENT_METHODS = [
  { value: 'pix', label: 'Pix' },
  { value: 'transferência', label: 'Transferência' },
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'cartão_crédito', label: 'Cartão de crédito' },
  { value: 'outro', label: 'Outro' },
];

const PAYMENT_LABEL: Record<string, string> = {
  pix: 'Pix', transferência: 'Transferência', dinheiro: 'Dinheiro',
  cartão_crédito: 'Cartão de crédito', outro: 'Outro',
};

export default function IncomePage() {
  const { transactions, loading, fetch, remove } = useTransactions();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('salário');
  const [month, setMonth] = useState(currentMonthKey());
  const [paymentMethod, setPaymentMethod] = useState('transferência');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [monthFilter, setMonthFilter] = useState('');

  const monthOptions = buildMonthOptions();
  const allCategories = useMemo(() => getAllCategories(), []);

  useEffect(() => { fetch(); }, [fetch]);

  const incomes = useMemo(() => {
    return transactions
      .filter((tx) => tx.type === 'receita')
      .filter((tx) => {
        if (!monthFilter) return true;
        const d = new Date(tx.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === monthFilter;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, monthFilter]);

  const totalMonth = useMemo(() => {
    const key = monthFilter || currentMonthKey();
    return transactions
      .filter((tx) => tx.type === 'receita')
      .filter((tx) => {
        const d = new Date(tx.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === key;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions, monthFilter]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(amount.replace(',', '.'));
    if (!description.trim() || isNaN(value) || value <= 0) {
      setError('Preencha a descrição e um valor válido.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const [year, mon] = month.split('-').map(Number);
      const monthName = new Date(year, mon - 1, 1)
        .toLocaleDateString('pt-BR', { month: 'long' });

      const msg = `recebi ${value.toFixed(2)} de ${description.trim()} via ${paymentMethod} em ${monthName} de ${year}`;
      await api.createTransaction(msg);
      setSuccess(`Receita "${description.trim()}" registrada.`);
      setDescription('');
      setAmount('');
      setTimeout(() => setSuccess(null), 4000);
      fetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar receita.');
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    await remove(deleting.id).catch(() => {});
    setDeleting(null);
    fetch();
  }

  return (
    <div className="py-2">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-slate-200/50 dark:border-zinc-800 pb-5">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-1">Receitas</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Salário, freelances e outras entradas de dinheiro</p>
        </div>

        {/* Summary card */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-lg shadow-emerald-500/20">
          <p className="text-sm font-medium text-white/70 mb-1">
            {monthFilter ? monthLabel(monthFilter) : monthLabel(currentMonthKey())}
          </p>
          <p className="text-4xl font-black">{brl(totalMonth)}</p>
          <p className="text-sm text-white/70 mt-1">total de receitas no período</p>
        </div>

        {/* Form */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-500" />
            Nova Receita
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Descrição</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Salário, Freelance, Aluguel..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Valor (R$)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Mês de competência</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                >
                  {monthOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm capitalize"
                >
                  {INCOME_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                  {allCategories.filter(c => !INCOME_CATEGORIES.includes(c)).map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Forma de recebimento</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                >
                  {PAYMENT_METHODS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {success && (
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl px-4 py-2.5">
                <Check className="w-4 h-4 shrink-0" />
                {success}
              </div>
            )}
            {error && <p className="text-sm text-rose-500">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 disabled:opacity-60 transition-all text-sm"
            >
              {submitting ? 'Registrando...' : 'Registrar Receita'}
            </button>
          </form>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3">
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Todos os meses</option>
            {monthOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {incomes.length > 0 && (
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {incomes.length} {incomes.length === 1 ? 'receita' : 'receitas'}
            </span>
          )}
        </div>

        {/* List */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Carregando...</div>
          ) : incomes.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <TrendingUp className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">Nenhuma receita neste período</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
              {incomes.map((tx) => (
                <div key={tx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{tx.description}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 capitalize">
                      {tx.category}
                      {tx.payment_method && (
                        <span className="text-slate-400 dark:text-slate-500"> · {PAYMENT_LABEL[tx.payment_method] || tx.payment_method}</span>
                      )}
                      <span className="text-slate-400 dark:text-slate-500"> · {new Date(tx.date).toLocaleDateString('pt-BR')}</span>
                    </p>
                  </div>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums text-sm">
                    +{brl(tx.amount)}
                  </p>
                  <button
                    onClick={() => setEditing(tx)}
                    className="p-2 text-slate-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleting(tx)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete modal */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setDeleting(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Excluir receita?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-200">{deleting.description}</span>
                {' · '}{brl(deleting.amount)}
              </p>
              <p className="text-xs text-rose-500">Essa ação não pode ser desfeita.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleting(null)} className="flex-1 py-3 rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 transition-all">Cancelar</button>
              <button onClick={confirmDelete} className="flex-1 py-3 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all">Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <EditIncomeModal
          tx={editing}
          onClose={() => setEditing(null)}
          onSave={async (id, fields) => {
            await api.updateTransaction(id, fields);
            setEditing(null);
            fetch();
          }}
        />
      )}
    </div>
  );
}

function EditIncomeModal({
  tx,
  onClose,
  onSave,
}: {
  tx: Transaction;
  onClose: () => void;
  onSave: (id: string, fields: { description: string; amount: number; category: string; payment_method: string }) => Promise<void>;
}) {
  const [description, setDescription] = useState(tx.description);
  const [amount, setAmount] = useState(String(tx.amount));
  const [category, setCategory] = useState(tx.category || 'salário');
  const [paymentMethod, setPaymentMethod] = useState(tx.payment_method || 'transferência');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const allCategories = useMemo(() => getAllCategories(), []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(amount.replace(',', '.'));
    if (!description.trim() || isNaN(value) || value <= 0) {
      setError('Preencha todos os campos.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(tx.id, { description: description.trim(), amount: value, category, payment_method: paymentMethod });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.');
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Editar receita</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Descrição</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Valor (R$)</label>
            <input type="text" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Categoria</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm capitalize">
                {[...INCOME_CATEGORIES, ...allCategories.filter(c => !INCOME_CATEGORIES.includes(c))].map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Recebimento</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm">
                {PAYMENT_METHODS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>
          {error && <p className="text-sm text-rose-500">{error}</p>}
          <button type="submit" disabled={saving}
            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 disabled:opacity-60 transition-all">
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </div>
    </div>
  );
}

const PAYMENT_METHODS = [
  { value: 'pix', label: 'Pix' },
  { value: 'transferência', label: 'Transferência' },
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'cartão_crédito', label: 'Cartão de crédito' },
  { value: 'outro', label: 'Outro' },
];
