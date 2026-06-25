'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTransactions } from '@/lib/hooks';
import { api, Transaction, ParsedTransaction } from '@/lib/api';
import { Download, Trash2, TrendingDown, TrendingUp, Pencil, X, RefreshCw } from 'lucide-react';

function brl(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

const CATEGORY_EMOJI: Record<string, string> = {
  alimentação: '🍔', transporte: '🚗', moradia: '🏠', saúde: '💊',
  lazer: '🎮', educação: '📚', vestuário: '👕', serviços: '🔧',
  investimento: '📈', outros: '📦',
};

const CATEGORIES = [
  'alimentação', 'transporte', 'moradia', 'saúde', 'lazer',
  'educação', 'vestuário', 'serviços', 'investimento', 'outros',
];

const PAYMENT_METHODS = [
  { value: 'pix', label: 'Pix' },
  { value: 'cartão_crédito', label: 'Cartão de crédito' },
  { value: 'cartão_débito', label: 'Cartão de débito' },
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'transferência', label: 'Transferência' },
  { value: 'outro', label: 'Outro' },
];

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

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// Opções de mês a partir das transações existentes (inclui meses FUTUROS
// criados por parcelamentos) + os próximos 3 meses e o mês atual.
function buildMonthOptions(transactions: Transaction[]) {
  const keys = new Set<string>();
  const now = new Date();
  for (let i = -1; i <= 3; i++) {
    keys.add(monthKey(new Date(now.getFullYear(), now.getMonth() + i, 1)));
  }
  for (const tx of transactions) keys.add(monthKey(new Date(tx.date)));

  const sorted = [...keys].sort().reverse(); // futuro/recente primeiro
  const options = [{ value: '', label: 'Todos os meses' }];
  for (const key of sorted) {
    const [y, m] = key.split('-').map(Number);
    const label = new Date(y, m - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    options.push({ value: key, label: label.charAt(0).toUpperCase() + label.slice(1) });
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
  const [preview, setPreview] = useState<ParsedTransaction | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [isFixedExpense, setIsFixedExpense] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [pendingFixedParsed, setPendingFixedParsed] = useState<ParsedTransaction | null>(null);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [totalInstallments, setTotalInstallments] = useState('1');
  const [currentInstallment, setCurrentInstallment] = useState('1');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'despesa' | 'receita'>('all');
  const [monthFilter, setMonthFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  const monthOptions = useMemo(() => buildMonthOptions(transactions), [transactions]);
  const categoryOptions = useMemo(
    () => [...new Set(transactions.map((t) => t.category).filter(Boolean))].sort(),
    [transactions]
  );
  const paymentOptions = useMemo(
    () => [...new Set(transactions.map((t) => t.payment_method).filter(Boolean))].sort(),
    [transactions]
  );

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (search && !tx.description.toLowerCase().includes(search.toLowerCase()) && !tx.category.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      if (categoryFilter && tx.category !== categoryFilter) return false;
      if (paymentFilter && tx.payment_method !== paymentFilter) return false;
      if (monthFilter) {
        const d = new Date(tx.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (key !== monthFilter) return false;
      }
      return true;
    })
    // Mais recém-adicionada no topo (created_at desc; date como desempate)
    .sort((a, b) => {
      const ca = new Date(a.created_at || a.date).getTime();
      const cb = new Date(b.created_at || b.date).getTime();
      return cb - ca;
    });
  }, [transactions, search, typeFilter, categoryFilter, paymentFilter, monthFilter]);

  const PAYMENT_LABEL: Record<string, string> = {
    pix: 'Pix', cartão_crédito: 'Cartão de crédito', cartão_débito: 'Cartão de débito',
    dinheiro: 'Dinheiro', transferência: 'Transferência', outro: 'Outro',
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitError(null);
    setPreviewError(null);

    try {
      setPreviewLoading(true);
      const parsed = await api.previewTransaction(message);
      setPreview(parsed);

      if (isFixedExpense) {
        setPendingFixedParsed(parsed);
        setShowSubscriptionModal(true);
        return;
      }

      if (parsed.payment_method === 'cartão_crédito') {
        setTotalInstallments(String(Math.max(1, parsed.installments || 1)));
        setCurrentInstallment('1');
        setShowCreditModal(true);
        return;
      }

      await sendTransaction(parsed);
    } catch (err) {
      setPreviewError(err instanceof Error ? err.message : 'Erro ao analisar a transação');
    } finally {
      setPreviewLoading(false);
    }
  }

  async function sendFixed(parsed: ParsedTransaction, asSubscription: boolean) {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(null);

      if (asSubscription) {
        await api.createSubscription({
          description: parsed.description,
          amount: parsed.amount,
          category: parsed.category,
          recurrence_type: 'mensal',
          start_date: parsed.start_date ? `${parsed.start_date}-01` : undefined,
        });
        setSubmitSuccess(`✓ ${parsed.description} registrada como assinatura! Confira na aba Assinaturas.`);
      } else {
        await api.createFixedExpense({
          description: parsed.description,
          amount: parsed.amount,
          category: parsed.category,
          recurrence_type: 'mensal',
          start_date: parsed.start_date ? `${parsed.start_date}-01` : undefined,
        });
        setSubmitSuccess(`✓ Gasto fixo ${parsed.description} registrado`);
      }

      setMessage('');
      setIsFixedExpense(false);
      setPendingFixedParsed(null);
      setPreview(null);
      setTimeout(() => setSubmitSuccess(null), 5000);
      fetch();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro ao criar transação');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function sendTransaction(parsed: ParsedTransaction) {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(null);

      const installments = parsed.payment_method === 'cartão_crédito' ? Number(totalInstallments) : undefined;
      const current_installment = parsed.payment_method === 'cartão_crédito' ? Number(currentInstallment) : undefined;
      const result = await create(message, installments, current_installment);
      setSubmitSuccess(`✓ ${result.description} foi registrado`);

      setMessage('');
      setIsFixedExpense(false);
      setPreview(null);
      setTimeout(() => setSubmitSuccess(null), 4000);
      fetch();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro ao criar transação');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deletar transação?')) return;
    await remove(id).catch(() => {});
  }

  async function handleSaveEdit(id: string, fields: { description: string; amount: number; type: 'despesa' | 'receita'; category: string; payment_method: string; installments?: number; current_installment?: number }) {
    await update(id, fields);
    setEditing(null);
  }

  return (
    <div className="py-2">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-slate-200/50 dark:border-slate-700/50 pb-5">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-1">Transações</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Descreva em linguagem natural — a IA interpreta</p>
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
                {previewLoading ? 'Analisando...' : isSubmitting ? '...' : 'Enviar'}
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <label className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-700/70 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFixedExpense}
                  onChange={(e) => setIsFixedExpense(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-fuchsia-600 focus:ring-fuchsia-500"
                />
                Gasto fixo
              </label>
              {isFixedExpense && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-200/70 dark:border-fuchsia-800/50 bg-fuchsia-50 dark:bg-fuchsia-950/30 px-3 py-2 text-xs font-medium text-fuchsia-600 dark:text-fuchsia-400">
                  <RefreshCw className="w-3 h-3" />
                  Será perguntado se é assinatura
                </span>
              )}
            </div>
            {preview && (
              <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/70 bg-slate-50 dark:bg-slate-900/60 p-4 text-sm text-slate-700 dark:text-slate-200">
                <p className="font-semibold mb-2">Prévia de interpretação</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="font-semibold">Descrição</p>
                    <p>{preview.description}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Categoria</p>
                    <p>{preview.category}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Pagamento</p>
                    <p>{preview.payment_method}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Parcelas</p>
                    <p>{preview.installments}x</p>
                  </div>
                </div>
              </div>
            )}
            {submitSuccess && <p className="text-green-600 dark:text-green-400 text-sm font-semibold">{submitSuccess}</p>}
            {submitError && <p className="text-red-600 dark:text-red-400 text-sm">{submitError}</p>}
            {previewError && <p className="text-orange-600 dark:text-orange-400 text-sm">{previewError}</p>}
          </form>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por descrição ou categoria..."
            className="w-full px-4 py-2.5 border border-slate-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm backdrop-blur-sm"
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
              className="px-3 py-2.5 border border-slate-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 backdrop-blur-sm"
            >
              <option value="all">Todos os tipos</option>
              <option value="despesa">Despesas</option>
              <option value="receita">Receitas</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2.5 border border-slate-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 backdrop-blur-sm capitalize"
            >
              <option value="">Todas categorias</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2.5 border border-slate-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 backdrop-blur-sm"
            >
              <option value="">Todos pagamentos</option>
              {paymentOptions.map((p) => (
                <option key={p} value={p}>{PAYMENT_LABEL[p] || p}</option>
              ))}
            </select>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="px-3 py-2.5 border border-slate-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 backdrop-blur-sm"
            >
              {monthOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          {transactions.length > 0 && (
            <button
              onClick={() => exportCSV(filtered)}
              className="flex items-center gap-2 px-4 py-2 bg-fuchsia-50 dark:bg-fuchsia-950/30 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-200/50 dark:border-fuchsia-800/50 rounded-xl font-semibold text-sm hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/40 transition-all"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
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
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 capitalize">
                      {tx.category}
                      {tx.payment_method && (
                        <span className="text-slate-400 dark:text-slate-500"> · {PAYMENT_LABEL[tx.payment_method] || tx.payment_method}</span>
                      )}
                    </p>
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

      {showSubscriptionModal && pendingFixedParsed && (
        <SubscriptionModal
          description={pendingFixedParsed.description}
          onClose={() => {
            setShowSubscriptionModal(false);
            setPendingFixedParsed(null);
          }}
          onSubscription={async () => {
            setShowSubscriptionModal(false);
            if (pendingFixedParsed) await sendFixed(pendingFixedParsed, true);
          }}
          onFixed={async () => {
            setShowSubscriptionModal(false);
            if (pendingFixedParsed) await sendFixed(pendingFixedParsed, false);
          }}
        />
      )}

      {showCreditModal && (
        <CreditModal
          totalInstallments={totalInstallments}
          currentInstallment={currentInstallment}
          onClose={() => setShowCreditModal(false)}
          onConfirm={async (total, current) => {
            setTotalInstallments(String(total));
            setCurrentInstallment(String(current));
            setShowCreditModal(false);
            if (preview) {
              await sendTransaction(preview);
            }
          }}
        />
      )}

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

function SubscriptionModal({
  description,
  onClose,
  onSubscription,
  onFixed,
}: {
  description: string;
  onClose: () => void;
  onSubscription: () => Promise<void>;
  onFixed: () => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);

  async function handleChoice(fn: () => Promise<void>) {
    setSaving(true);
    try { await fn(); } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-1">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-900/30 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-5 h-5 text-fuchsia-600 dark:text-fuchsia-400" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-fuchsia-500 dark:text-fuchsia-400">Gasto Fixo</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">É uma assinatura?</h3>
            </div>
          </div>
          <button onClick={onClose} disabled={saving} className="text-slate-400 hover:text-slate-600 dark:hover:text-white mt-1 disabled:opacity-40">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 pl-14">
          &ldquo;<span className="font-semibold text-slate-800 dark:text-slate-200">{description}</span>&rdquo; tem cobrança automática recorrente?
        </p>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={() => handleChoice(onSubscription)}
            disabled={saving}
            className="group flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-fuchsia-200 dark:border-fuchsia-800/60 bg-fuchsia-50 dark:bg-fuchsia-950/30 hover:border-fuchsia-400 dark:hover:border-fuchsia-500 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-950/60 transition-all disabled:opacity-50"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">📱</span>
            <div className="text-center">
              <p className="font-bold text-sm text-fuchsia-700 dark:text-fuchsia-300">Sim, assinatura</p>
              <p className="text-xs text-fuchsia-500/80 dark:text-fuchsia-400/60 mt-0.5">Netflix, Spotify, planos...</p>
            </div>
          </button>

          <button
            onClick={() => handleChoice(onFixed)}
            disabled={saving}
            className="group flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all disabled:opacity-50"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">📋</span>
            <div className="text-center">
              <p className="font-bold text-sm text-slate-700 dark:text-slate-200">Não, gasto fixo</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Aluguel, conta, plano...</p>
            </div>
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500">
          Assinaturas ficam numa aba separada para melhor controle.
        </p>
      </div>
    </div>
  );
}

function CreditModal({
  totalInstallments,
  currentInstallment,
  onClose,
  onConfirm,
}: {
  totalInstallments: string;
  currentInstallment: string;
  onClose: () => void;
  onConfirm: (total: number, current: number) => Promise<void>;
}) {
  const [total, setTotal] = useState(totalInstallments);
  const [current, setCurrent] = useState(currentInstallment);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const totalNum = parseInt(total, 10);

  async function confirm() {
    const totalNumber = parseInt(total, 10);
    const currentNumber = parseInt(current, 10);

    if (isNaN(totalNumber) || totalNumber < 1) {
      setError('Informe o total de parcelas.');
      return;
    }
    if (isNaN(currentNumber) || currentNumber < 1 || currentNumber > totalNumber) {
      setError('Informe a parcela atual válida.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onConfirm(totalNumber, currentNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao confirmar.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-500 dark:text-blue-400">Cartão de crédito</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">Detalhes das parcelas</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Informe o total e em qual parcela você está agora.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white mt-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <span>Total de parcelas</span>
            <input
              type="number"
              min="1"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <span>Parcela atual</span>
            <input
              type="number"
              min="1"
              max={total}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </label>
        </div>

        {!isNaN(totalNum) && totalNum > 1 && (
          <div className="mb-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-800/40">
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
              As parcelas restantes serão lançadas automaticamente nos próximos meses.
            </p>
          </div>
        )}

        {error && <p className="text-sm text-rose-500 mb-3">{error}</p>}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-950 transition"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={saving}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-blue-600 disabled:opacity-70 transition-all"
          >
            {saving ? 'Confirmando...' : totalNum === 1 ? 'Confirmar' : 'Salvar parcelas'}
          </button>
        </div>
      </div>
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
  onSave: (id: string, fields: { description: string; amount: number; type: 'despesa' | 'receita'; category: string; payment_method: string; installments?: number; current_installment?: number }) => Promise<void>;
}) {
  const [description, setDescription] = useState(tx.description);
  const [amount, setAmount] = useState(String(tx.amount));
  const [type, setType] = useState<'despesa' | 'receita'>(tx.type);
  const [category, setCategory] = useState(tx.category || 'outros');
  const [paymentMethod, setPaymentMethod] = useState(tx.payment_method || '');
  const [installments, setInstallments] = useState(String(tx.installments || 1));
  const [currentInstallment, setCurrentInstallment] = useState(String(tx.installments && tx.installments > 1 ? 1 : 1));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isParcelado = parseInt(installments) > 1;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(amount.replace(',', '.'));
    const tot = parseInt(installments);
    const cur = parseInt(currentInstallment);
    if (!description.trim() || isNaN(value) || value <= 0) {
      setError('Preencha um nome e um valor válido.');
      return;
    }
    if (isParcelado && (cur < 1 || cur > tot)) {
      setError(`Parcela atual deve ser entre 1 e ${tot}.`);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(tx.id, {
        description: description.trim(), amount: value, type, category, payment_method: paymentMethod,
        installments: isParcelado ? tot : undefined,
        current_installment: isParcelado ? cur : undefined,
      });
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm capitalize"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
                {category && !CATEGORIES.includes(category) && <option value={category}>{category}</option>}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Pagamento</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm"
              >
                <option value="">—</option>
                {PAYMENT_METHODS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
                {paymentMethod && !PAYMENT_METHODS.some((p) => p.value === paymentMethod) && (
                  <option value={paymentMethod}>{paymentMethod}</option>
                )}
              </select>
            </div>
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

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Total de parcelas</label>
            <input
              type="number"
              min="1"
              value={installments}
              onChange={(e) => setInstallments(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm"
            />
          </div>

          {isParcelado && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Parcela atual (mês corrente)</label>
              <input
                type="number"
                min="1"
                max={installments}
                value={currentInstallment}
                onChange={(e) => setCurrentInstallment(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm"
              />
              <p className="text-xs text-slate-400 mt-1">As parcelas restantes serão lançadas nos próximos meses.</p>
            </div>
          )}

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
