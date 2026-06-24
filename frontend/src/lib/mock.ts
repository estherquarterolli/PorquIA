/**
 * Dados fictícios — coerentes com o produto e em PT-BR.
 *
 * Estruturados para espelhar os tipos reais de `@/lib/api` (Summary, MonthlyData,
 * BudgetStatus, Transaction...). Para ligar à API depois, basta trocar estas
 * constantes pelos hooks/endpoints reais sem mexer no layout dos componentes.
 */
import type { Summary, MonthlyData, BudgetStatus, Transaction } from './api';

export const fmtBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export const CATEGORY_META: Record<string, { emoji: string; color: string; label: string }> = {
  alimentação: { emoji: '🍔', color: '#f97316', label: 'Alimentação' },
  transporte:  { emoji: '🚗', color: '#3b82f6', label: 'Transporte' },
  moradia:     { emoji: '🏠', color: '#8b5cf6', label: 'Moradia' },
  saúde:       { emoji: '💊', color: '#10b981', label: 'Saúde' },
  lazer:       { emoji: '🎮', color: '#ec4899', label: 'Lazer' },
  educação:    { emoji: '📚', color: '#06b6d4', label: 'Educação' },
  vestuário:   { emoji: '👕', color: '#f43f5e', label: 'Vestuário' },
  serviços:    { emoji: '🔧', color: '#eab308', label: 'Serviços' },
  investimento:{ emoji: '📈', color: '#22c55e', label: 'Investimento' },
  outros:      { emoji: '📦', color: '#94a3b8', label: 'Outros' },
};

export const categoryMeta = (cat: string) =>
  CATEGORY_META[cat] ?? { emoji: '📦', color: '#94a3b8', label: cat };

/* ── Resumo do mês ── */
export const mockSummary: Summary = {
  totalReceitas: 7850,
  totalDespesas: 4318.4,
  saldo: 3531.6,
  porCategoria: {
    moradia: 1650,
    alimentação: 980.5,
    transporte: 472.9,
    lazer: 410,
    saúde: 305,
    serviços: 280,
    vestuário: 220,
  },
};

/* variação % vs mês anterior — usado nos badges de tendência */
export const mockTrends = {
  saldo: 12.4,
  receitas: 4.2,
  despesas: -6.8, // gastou menos = bom
  economia: 18.1,
};

export const taxaPoupanca = Math.round(
  ((mockSummary.totalReceitas - mockSummary.totalDespesas) / mockSummary.totalReceitas) * 100,
);

/* ── Histórico mensal (receitas x despesas) ── */
export const mockMonthly: MonthlyData[] = [
  { month: '2026-01', label: 'Jan', receitas: 7200, despesas: 4980 },
  { month: '2026-02', label: 'Fev', receitas: 7400, despesas: 4520 },
  { month: '2026-03', label: 'Mar', receitas: 7100, despesas: 5310 },
  { month: '2026-04', label: 'Abr', receitas: 7650, despesas: 4710 },
  { month: '2026-05', label: 'Mai', receitas: 7530, despesas: 4635 },
  { month: '2026-06', label: 'Jun', receitas: 7850, despesas: 4318 },
];

/* saldo acumulado ao longo do mês (sparkline do card de saldo) */
export const mockSaldoSpark = [2100, 2480, 2350, 2890, 3120, 3050, 3320, 3531].map((v) => ({ value: v }));
export const mockReceitaSpark = [6.2, 6.8, 6.5, 7.1, 7.4, 7.2, 7.6, 7.85].map((v) => ({ value: v }));
export const mockDespesaSpark = [5.1, 4.5, 5.3, 4.7, 4.6, 4.8, 4.4, 4.32].map((v) => ({ value: v }));

/* ── Orçamentos ── */
export const mockBudgets: BudgetStatus[] = [
  { id: 'b1', user_id: 'u', category: 'moradia',     monthly_limit: 1800, created_at: '', spent: 1650,  percent: 92,  status: 'warning' },
  { id: 'b2', user_id: 'u', category: 'alimentação', monthly_limit: 1000, created_at: '', spent: 980.5, percent: 98,  status: 'warning' },
  { id: 'b3', user_id: 'u', category: 'transporte',  monthly_limit: 600,  created_at: '', spent: 472.9, percent: 79,  status: 'ok' },
  { id: 'b4', user_id: 'u', category: 'lazer',       monthly_limit: 350,  created_at: '', spent: 410,   percent: 117, status: 'over' },
  { id: 'b5', user_id: 'u', category: 'saúde',       monthly_limit: 500,  created_at: '', spent: 305,   percent: 61,  status: 'ok' },
];

/* ── Transações recentes ── */
const tx = (
  id: string, amount: number, description: string, category: string,
  type: 'despesa' | 'receita', daysAgo: number, payment_method = 'pix',
): Transaction => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return {
    id, user_id: 'u', amount, description, category, payment_method,
    installments: 1, type, date: d.toISOString(), created_at: d.toISOString(),
  };
};

export const mockTransactions: Transaction[] = [
  tx('t1', 5800, 'Salário', 'outros', 'receita', 0, 'transferência'),
  tx('t2', 89.9, 'Mercado Pão de Açúcar', 'alimentação', 'despesa', 0, 'crédito'),
  tx('t3', 32, 'Uber para o trabalho', 'transporte', 'despesa', 1, 'pix'),
  tx('t4', 1650, 'Aluguel', 'moradia', 'despesa', 2, 'transferência'),
  tx('t5', 49.9, 'Spotify + Netflix', 'lazer', 'despesa', 2, 'crédito'),
  tx('t6', 2050, 'Freelance design', 'outros', 'receita', 3, 'pix'),
  tx('t7', 120, 'Farmácia', 'saúde', 'despesa', 4, 'débito'),
  tx('t8', 500, 'Aporte Tesouro Direto', 'investimento', 'despesa', 5, 'transferência'),
];
