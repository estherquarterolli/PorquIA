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

class ApiClient {
  private chatId: string | null = null;

  setChatId(id: string) {
    this.chatId = id;
    localStorage.setItem('chat_id', id);
  }

  getChatId(): string {
    if (this.chatId) return this.chatId;
    const stored = localStorage.getItem('chat_id');
    if (!stored) throw new Error('Chat ID não configurado');
    this.chatId = stored;
    return this.chatId;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: Record<string, unknown>
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-chat-id': this.getChatId(),
    };

    const options: RequestInit = {
      method,
      headers,
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
}

export const api = new ApiClient();
