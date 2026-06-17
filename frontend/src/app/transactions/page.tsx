'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTransactions } from '@/lib/hooks';
import { Transaction } from '@/lib/api';
import { Download, Trash2, TrendingDown, TrendingUp, Pencil, X } from 'lucide-react';

function brl(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

const CATEGORY_EMOJI: Record<string, string> = {
  alimentação: '🍔', transporte: '🚗', moradia: '🏠', saúde: '💊',
  lazer: '🎮', educação: '📚', vestuário: '👕', serviços: '🔧',
  investimento: '📈', outros: '📦',
};

function exportCSV(transactions: Transaction[]) {
  const header = 'Data,Descrição,Categoria,Método,Tipo,Valor\n';
  const rows = transactions.map((tx) =>
    [
      new Date(tx.date).toLocaleDateString('pt-BR'),
      `"${tx.description}"`,
      tx.category,
      tx.payment_method || '',
      tx.type,
      tx.amount.toFixed(2).replace('.', ','),
    ].join(',')
  ).join('\n');

  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transacoes-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function getMonthOptions() {
  const options = [{ value: '', label: 'Todos os meses' }];
  for (let i = 0; i < 12; i++) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    options.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) });
  }
  return options;
}

export default function TransactionsPage() {
  const { transactions, loading, fetch, create, update, remove } = useTransactions();
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'despesa' | 'receita'>('all');
  const [monthFilter, setMonthFilter] = useState('');

  const monthOptions = useMemo(() => getMonthOptions(), []);

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (search && !tx.description.toLowerCase().includes(search.toLowerCase()) && !tx.category.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      if (monthFilter) {
        const d = new Date(tx.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (key !== monthFilter) return false;
      }
      return true;
    });
  }, [transactions, search, typeFilter, monthFilter]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(null);
      const result = await create(message);
      setMessage('');
      setSubmitSuccess(`✓ ${result.description} foi registrado`);
      setTimeout(() => setSubmitSuccess(null), 4000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deletar transação?')) return;
    await remove(id).catch(() => {});
  }

  async function handleSaveEdit(id: string, fields: { description: string; amount: number; type: 'despesa' | 'receita' }) {
    await update(id, fields);
    setEditing(null);
  }

  return (
    <div className="min-h-screen px-6 lg:px-10 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200/50 dark:border-slate-700/50 pb-8">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-2">Transações</h1>
          <p className="text-slate-600 dark:text-slate-400 text-base">Descreva em linguagem natural — a IA interpreta</p>
        </div>

        {/* Input */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 shadow-sm dark:shadow-lg dark:shadow-black/20 border border-slate-200/50 dark:border-slate-700/50">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder='Ex: "gastei 50 no mercado"'
                className="w-full px-5 py-3.5 pr-28 border border-slate-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-700/30 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base backdrop-blur-sm"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white disabled:text-slate-400 rounded-lg text-sm font-bold transition-all"
              >
                {isSubmitting ? '...' : 'Enviar'}
              </button>
            </div>
            {submitSuccess && <p className="text-green-600 dark:text-green-400 text-sm font-semibold">{submitSuccess}</p>}
            {submitError && <p className="text-red-600 dark:text-red-400 text-sm">{submitError}</p>}
          </form>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="flex-1 px-4 py-2.5 border border-slate-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm backdrop-blur-sm"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
            className="px-4 py-2.5 border border-slate-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
          >
            <option value="all">Todos</option>
            <option value="despesa">Despesas</option>
            <option value="receita">Receitas</option>
          </select>
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
          >
            {monthOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {transactions.length > 0 && (
            <button
              onClick={() => exportCSV(filtered)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50 rounded-xl font-semibold text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
          )}
        </div>

        {/* List */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-sm dark:shadow-lg dark:shadow-black/20 border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Carregando...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm font-medium">Nenhuma transação</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
              {filtered.map((tx) => (
                <div key={tx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors group">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    tx.type === 'receita' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-rose-100 dark:bg-rose-900/30'
                  }`}>
                    {tx.type === 'receita' ? (
                      <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{tx.description}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{tx.category}</p>
                  </div>
                  <p className={`font-bold tabular-nums text-sm ${
                    tx.type === 'receita' ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {tx.type === 'receita' ? '+' : '-'}{brl(tx.amount)}
                  </p>
                  <button
                    onClick={() => setEditing(tx)}
                    className="p-2 text-slate-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(tx.id)}
                    className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Deletar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {editing && (
        <EditModal
          tx={editing}
          onClose={() => setEditing(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}

function EditModal({
  tx,
  onClose,
  onSave,
}: {
  tx: Transaction;
  onClose: () => void;
  onSave: (id: string, fields: { description: string; amount: number; type: 'despesa' | 'receita' }) => Promise<void>;
}) {
  const [description, setDescription] = useState(tx.description);
  const [amount, setAmount] = useState(String(tx.amount));
  const [type, setType] = useState<'despesa' | 'receita'>(tx.type);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(amount.replace(',', '.'));
    if (!description.trim() || isNaN(value) || value <= 0) {
      setError('Preencha um nome e um valor válido.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(tx.id, { description: description.trim(), amount: value, type });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.');
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Editar transação</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Nome</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Valor (R$)</label>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm"
            />
          </div>
          <div className="flex gap-2">
            {(['despesa', 'receita'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize ${
                  type === t
                    ? t === 'despesa'
                      ? 'bg-rose-500 text-white'
                      : 'bg-emerald-500 text-white'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {error && <p className="text-sm text-rose-500">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-fuchsia-600 to-pink-600 shadow-lg shadow-pink-600/30 disabled:opacity-60 transition-all active:scale-[0.98]"
          >
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </div>
    </div>
  );
}
