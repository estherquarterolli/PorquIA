'use client';

import { useEffect, useState, useCallback } from 'react';
import { api, RecurringExpense } from '@/lib/api';
import { Repeat, Plus, Ban, X, CheckCircle2 } from 'lucide-react';

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const CATEGORIES = ['alimentação', 'transporte', 'moradia', 'saúde', 'lazer', 'educação', 'vestuário', 'serviços', 'investimento', 'outros'];

export default function RecurringPage() {
  const [items, setItems] = useState<RecurringExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [months, setMonths] = useState('12');
  const [recurrenceType, setRecurrenceType] = useState('mensal');
  const todayISO = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(todayISO);
  const [endDate, setEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ending, setEnding] = useState<RecurringExpense | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    api.getRecurring().then((r) => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => load(), [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(amount.replace(',', '.'));
    if (!description.trim() || isNaN(value) || value <= 0) {
      setError('Preencha nome e valor válido.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const r = await api.createFixedExpense({
        description: description.trim(),
        amount: value,
        category: category.trim().toLowerCase() || 'outros',
        recurrence_type: recurrenceType,
        start_date: startDate,
        end_date: endDate || undefined,
        occurrences: endDate ? undefined : parseInt(months) || 12,
      });
      setDescription(''); setAmount(''); setCategory(''); setEndDate('');
      setToast(`Gasto fixo criado: ${r.created} ocorrência(s) ✅`);
      setTimeout(() => setToast(null), 3500);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEnd(description: string, fromMonth: string) {
    await api.endRecurring(description, fromMonth);
    setEnding(null);
    setToast('Recorrente encerrado ✅');
    setTimeout(() => setToast(null), 3500);
    load();
  }

  return (
    <div className="py-2">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="border-b border-slate-200/50 dark:border-zinc-800 pb-5">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-1">Gastos Fixos</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Despesas que se repetem (mensal, trimestral, anual...) com início e fim configuráveis</p>
        </div>

        {/* Form */}
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Novo gasto fixo</h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nome (ex: Aluguel, Netflix, Academia)"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Valor/mês (R$)"
                className="px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm"
              />
              <input
                type="text"
                list="rec-categories"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Categoria"
                className="px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm capitalize"
              />
              <datalist id="rec-categories">
                {CATEGORIES.map((c) => <option key={c} value={c} />)}
              </datalist>
              <select
                value={recurrenceType}
                onChange={(e) => setRecurrenceType(e.target.value)}
                className="px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm"
              >
                <option value="mensal">Mensal</option>
                <option value="bimestral">Bimestral</option>
                <option value="trimestral">Trimestral</option>
                <option value="semestral">Semestral</option>
                <option value="anual">Anual</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">A partir de</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Até (opcional)</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  {endDate ? 'Qtd (ignorada)' : 'Quantas vezes'}
                </label>
                <select
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                  disabled={!!endDate}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm disabled:opacity-50"
                >
                  <option value="6">6 vezes</option>
                  <option value="12">12 vezes</option>
                  <option value="24">24 vezes</option>
                  <option value="36">36 vezes</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Defina uma <strong>data de fim</strong> para encerrar automaticamente, ou escolha <strong>quantas vezes</strong> repetir.
            </p>
            {error && <p className="text-sm text-rose-500">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-fuchsia-600 to-pink-600 shadow-lg shadow-pink-600/30 disabled:opacity-60 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" /> {submitting ? 'Criando...' : 'Adicionar gasto fixo'}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="space-y-3">
          {loading ? (
            <p className="text-center text-slate-400 py-8">Carregando...</p>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Repeat className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium">Nenhum gasto fixo ainda</p>
            </div>
          ) : (
            items.map((r) => (
              <div key={`${r.description}-${r.amount}`} className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm p-5 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${r.active ? 'bg-fuchsia-100 dark:bg-fuchsia-950/40 text-fuchsia-500' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400'}`}>
                  <Repeat className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-slate-900 dark:text-white capitalize">{r.description}</p>
                    {r.is_fixed && <span className="text-[10px] font-bold bg-fuchsia-100 dark:bg-fuchsia-950/40 text-fuchsia-600 dark:text-fuchsia-400 px-2 py-0.5 rounded-full">FIXO</span>}
                    {!r.active && <span className="text-[10px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-500 px-2 py-0.5 rounded-full">ENCERRADO</span>}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    {r.category} · {r.future_count} mês(es) à frente
                  </p>
                </div>
                <p className="font-bold text-slate-900 dark:text-white text-sm tabular-nums">{brl(r.amount)}<span className="text-xs text-slate-400">/mês</span></p>
                {r.active && (
                  <button
                    onClick={() => setEnding(r)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Encerrar"
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {ending && <EndModal item={ending} onClose={() => setEnding(null)} onConfirm={handleEnd} />}

      {toast && (
        <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-500 text-white text-sm font-semibold shadow-lg animate-fade-in-up">
          <CheckCircle2 className="w-4 h-4" /> {toast}
        </div>
      )}
    </div>
  );
}

function EndModal({
  item,
  onClose,
  onConfirm,
}: {
  item: RecurringExpense;
  onClose: () => void;
  onConfirm: (description: string, fromMonth: string) => Promise<void>;
}) {
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [fromMonth, setFromMonth] = useState(defaultMonth);
  const [saving, setSaving] = useState(false);

  async function confirm() {
    setSaving(true);
    try {
      await onConfirm(item.description, fromMonth);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up" onClick={onClose}>
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Encerrar recorrente</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Vamos remover <strong className="text-slate-700 dark:text-slate-200 capitalize">{item.description}</strong> a partir do mês escolhido (inclusive). Meses anteriores ficam no histórico.
        </p>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Encerrar a partir de</label>
        <input
          type="month"
          value={fromMonth}
          onChange={(e) => setFromMonth(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm mb-5"
        />
        <button
          onClick={confirm}
          disabled={saving}
          className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-rose-500 to-red-500 shadow-lg shadow-red-500/30 disabled:opacity-60 transition-all active:scale-[0.98]"
        >
          {saving ? 'Encerrando...' : 'Encerrar'}
        </button>
      </div>
    </div>
  );
}
