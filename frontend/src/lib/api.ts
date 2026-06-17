import { auth } from './firebase';
import { signOut } from 'firebase/auth';

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

    if (response.status === 401) {
      await signOut(auth);
      if (typeof window !== 'undefined') window.location.href = '/login';
      throw new Error('Sessão expirada. Faça login novamente.');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async getTransactions(limit = 50): Promise<{ data: Transaction[] }> {
    return this.request('GET', `/api/transactions?limit=${limit}`);
  }

  async createTransaction(message: string): Promise<{ data: Transaction }> {
    return this.request('POST', '/api/transactions', { message });
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

  async getUserProfile(): Promise<{ id: string; email: string; telegram_chat_id: string | null; created_at: string }> {
    return this.request('GET', '/api/users/profile');
  }

  async linkTelegram(telegramChatId: string): Promise<void> {
    return this.request('POST', '/api/users/link-telegram', { telegram_chat_id: telegramChatId });
  }
}

export const api = new ApiClient();
