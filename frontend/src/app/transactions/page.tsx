'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTransactions } from '@/lib/hooks';
import { Transaction } from '@/lib/api';
import { fmtBRL, categoryMeta } from '@/lib/mock';
import { Download, Trash2, Sparkles, Search } from 'lucide-react';

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
  const { transactions, loading, fetchTransactions, create, remove } = useTransactions();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'despesa' | 'receita'>('all');
  const [monthFilter, setMonthFilter] = useState('');

  const monthOptions = useMemo(() => getMonthOptions(), []);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">Transações</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Descreva em linguagem natural — a IA interpreta e categoriza.</p>
      </div>

      {/* Input IA */}
      <div className="card p-5">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500" />
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Ex: "gastei 50 no mercado" ou "recebi 2000 de freela"'
              className="field !pl-11 !pr-28 !py-3.5"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="btn-primary absolute right-1.5 top-1/2 -translate-y-1/2 !py-2.5 !px-5"
            >
              {isSubmitting ? '…' : 'Registrar'}
            </button>
          </div>
          {submitSuccess && <p className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold">{submitSuccess}</p>}
          {submitError && <p className="text-rose-600 dark:text-rose-400 text-sm">{submitError}</p>}
        </form>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar…" className="field !pl-10" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)} className="field sm:w-40">
          <option value="all">Todos os tipos</option>
          <option value="despesa">Despesas</option>
          <option value="receita">Receitas</option>
        </select>
        <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="field sm:w-48">
          {monthOptions.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
        </select>
        {transactions.length > 0 && (
          <button onClick={() => exportCSV(filtered)} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-500/20 font-semibold text-sm hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-all">
            <Download className="w-4 h-4" /> CSV
          </button>
        )}
      </div>

      {/* Lista */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400 text-sm">Carregando…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl brand-gradient-soft grid place-items-center text-2xl mb-3">🧾</div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Nenhuma transação por aqui</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200/60 dark:divide-white/5">
            {filtered.map((tx) => {
              const meta = categoryMeta(tx.category);
              const receita = tx.type === 'receita';
              return (
                <div key={tx.id} className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-brand-50/50 dark:hover:bg-white/5 transition-colors group">
                  <span className="w-11 h-11 rounded-xl grid place-items-center text-lg shrink-0" style={{ backgroundColor: `${meta.color}1f` }}>
                    {meta.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{tx.description}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {meta.label} · {new Date(tx.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <p className={`font-bold tabular-nums text-sm shrink-0 ${receita ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}`}>
                    {receita ? '+' : '−'}{fmtBRL(tx.amount)}
                  </p>
                  <button onClick={() => handleDelete(tx.id)} className="p-2 text-slate-300 dark:text-slate-600 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
