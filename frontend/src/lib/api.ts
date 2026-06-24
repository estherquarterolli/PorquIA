import { auth } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  category: string;
  payment_method: string;
  installments: number;
  type: 'despesa' | 'receita';
  date: string;
  created_at: string;
}

export interface ParsedTransaction {
  amount: number;
  description: string;
  category: string;
  payment_method: string;
  installments: number;
  start_date: string | null;
  type: 'despesa' | 'receita';
}

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  monthly_limit: number;
  created_at: string;
}

export interface Summary {
  totalDespesas: number;
  totalReceitas: number;
  saldo: number;
  porCategoria: Record<string, number>;
}

export interface MonthlyData {
  month: string;
  label: string;
  despesas: number;
  receitas: number;
}

export interface BudgetStatus extends Budget {
  spent: number;
  percent: number;
  status: 'ok' | 'warning' | 'over';
}

export interface InvestmentMonth {
  month: string;
  label: string;
  total: number;
}

export interface Subscription {
  description: string;
  category: string;
  amount: number;
  frequency: 'semanal' | 'quinzenal' | 'mensal' | 'anual';
  occurrences: number;
  last_charge: string;
  next_charge: string;
  total_spent: number;
}

export interface InvestmentSummary {
  totalMes: number;
  totalAno: number;
  mediaMensal: number;
  historico: InvestmentMonth[];
  ultimosAportes: Pick<Transaction, 'id' | 'amount' | 'description' | 'date'>[];
}

export interface RecurringExpense {
  description: string;
  category: string;
  amount: number;
  is_fixed: boolean;
  months_count: number;
  future_count: number;
  last_charge: string;
  active: boolean;
}

export interface UpcomingMonth {
  month: string;
  label: string;
  despesas: number;
  receitas: number;
  items: Pick<Transaction, 'id' | 'amount' | 'description' | 'category' | 'type' | 'date'>[];
}

export interface BankProvider {
  id: string;
  label: string;
  real: boolean;
}

export interface BankConnection {
  id: string;
  provider: string;
  label: string;
  account_balance: number | null;
  credit_limit: number | null;
  credit_used: number | null;
  last_synced_at: string;
}

export interface BankConnectResult {
  connection: BankConnection;
  imported: number;
  skipped: number;
}

export type Plan = 'trial' | 'monthly' | 'annual' | 'whitelisted' | 'inactive';

export interface BillingStatus {
  email: string;
  plan: Plan;
  trial_ends_at: string | null;
  subscription_ends_at: string | null;
  pending_billing_id?: string | null;
  pending_plan?: string | null;
  active: boolean;
}

export interface CheckoutResult {
  url: string;
}

class ApiClient {
  private async getToken(): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error('Não autenticado');
    return user.getIdToken();
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: Record<string, unknown>
  ): Promise<T> {
    const token = await this.getToken();

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async getTransactions(limit = 300): Promise<{ data: Transaction[] }> {
    return this.request('GET', `/api/transactions?limit=${limit}`);
  }

  async createTransaction(
    message: string,
    installments?: number,
    current_installment?: number
  ): Promise<{ data: Transaction }> {
    return this.request('POST', '/api/transactions', { message, installments, current_installment });
  }

  async previewTransaction(message: string): Promise<ParsedTransaction> {
    return this.request('POST', '/api/transactions/preview', { message });
  }

  async updateTransaction(
    id: string,
    fields: { amount?: number; description?: string; category?: string; type?: 'despesa' | 'receita'; payment_method?: string }
  ): Promise<{ data: Transaction }> {
    return this.request('PUT', `/api/transactions/${id}`, fields);
  }

  async deleteTransaction(id: string): Promise<{ data: Transaction }> {
    return this.request('DELETE', `/api/transactions/${id}`);
  }

  async getSummary(): Promise<Summary> {
    return this.request('GET', '/api/transactions/summary');
  }

  async getBudgets(): Promise<{ data: Budget[] }> {
    return this.request('GET', '/api/budgets');
  }

  async createBudget(category: string, monthly_limit: number): Promise<{ data: Budget }> {
    return this.request('POST', '/api/budgets', { category, monthly_limit });
  }

  async updateBudget(id: string, monthly_limit: number): Promise<{ data: Budget }> {
    return this.request('PUT', `/api/budgets/${id}`, { monthly_limit });
  }

  async deleteBudget(id: string): Promise<{ data: Budget }> {
    return this.request('DELETE', `/api/budgets/${id}`);
  }

  async getMonthlyData(months = 6): Promise<MonthlyData[]> {
    return this.request('GET', `/api/transactions/monthly?months=${months}`);
  }

  async getBudgetStatus(): Promise<BudgetStatus[]> {
    return this.request('GET', '/api/budgets/status');
  }

  async getInvestmentSummary(): Promise<InvestmentSummary> {
    return this.request('GET', '/api/investments/summary');
  }

  async getSubscriptions(): Promise<Subscription[]> {
    return this.request('GET', '/api/subscriptions');
  }

  async createSubscription(body: {
    description: string;
    amount: number;
    category?: string;
    recurrence_type?: string;
    start_date?: string;
    end_date?: string;
    occurrences?: number;
    months?: number;
  }): Promise<{ created: number }> {
    return this.request('POST', '/api/subscriptions', body);
  }

  async createFixedExpense(body: {
    description: string;
    amount: number;
    category?: string;
    recurrence_type?: string;
    start_date?: string;
    end_date?: string;
    occurrences?: number;
    months?: number;
  }): Promise<{ created: number }> {
    return this.request('POST', '/api/recurring', body);
  }

  async getUserProfile(): Promise<{ id: string; email: string; telegram_chat_id: string | null; created_at: string }> {
    return this.request('GET', '/api/users/profile');
  }

  async linkTelegram(telegramChatId: string): Promise<void> {
    return this.request('POST', '/api/users/link-telegram', { telegram_chat_id: telegramChatId });
  }

  async getRecurring(): Promise<{ data: RecurringExpense[] }> {
    return this.request('GET', '/api/recurring');
  }

  async endRecurring(description: string, from_month: string): Promise<{ deleted: number }> {
    return this.request('POST', '/api/recurring/end', { description, from_month });
  }

  async getUpcoming(months = 6): Promise<{ data: UpcomingMonth[] }> {
    return this.request('GET', `/api/recurring/upcoming?months=${months}`);
  }

  async resetFinances(): Promise<{ transactions: number; budgets: number }> {
    return this.request('POST', '/api/users/reset');
  }

  async getBankProviders(): Promise<{ data: BankProvider[] }> {
    return this.request('GET', '/api/banks/providers');
  }

  async getBankConnections(): Promise<{ data: BankConnection[] }> {
    return this.request('GET', '/api/banks');
  }

  async connectBank(provider: string, credentials?: Record<string, string>): Promise<BankConnectResult> {
    return this.request('POST', '/api/banks/connect', { provider, credentials });
  }

  async syncBank(id: string): Promise<BankConnectResult> {
    return this.request('POST', `/api/banks/${id}/sync`);
  }

  async removeBank(id: string): Promise<{ removed: boolean }> {
    return this.request('DELETE', `/api/banks/${id}`);
  }

  async importStatement(content: string, filename: string): Promise<{ found: number; imported: number; skipped: number }> {
    return this.request('POST', '/api/banks/import', { content, filename });
  }

  // ── Billing / assinatura ──────────────────────────────────────
  async getBillingStatus(): Promise<BillingStatus> {
    return this.request('GET', '/api/billing/status');
  }

  async createCheckout(plan: 'monthly' | 'annual'): Promise<CheckoutResult> {
    return this.request('POST', '/api/billing/checkout', { plan });
  }

  async verifyPayment(): Promise<BillingStatus> {
    return this.request('POST', '/api/billing/verify');
  }
}

export const api = new ApiClient();
