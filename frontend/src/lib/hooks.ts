'use client';

import { useState, useCallback, useEffect } from 'react';
import { api, Transaction, Budget, Summary } from './api';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getTransactions();
      setTransactions(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar transações');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => fetch();
    window.addEventListener('transactions-changed', handler);
    return () => window.removeEventListener('transactions-changed', handler);
  }, [fetch]);

  const create = useCallback(async (message: string, installments?: number, current_installment?: number) => {
    try {
      setError(null);
      const result = await api.createTransaction(message, installments, current_installment);
      setTransactions((prev) => [result.data, ...prev]);
      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar transação';
      setError(message);
      throw err;
    }
  }, []);

  const update = useCallback(
    async (id: string, fields: { amount?: number; description?: string; category?: string; type?: 'despesa' | 'receita' }) => {
      try {
        setError(null);
        const result = await api.updateTransaction(id, fields);
        setTransactions((prev) => prev.map((t) => (t.id === id ? result.data : t)));
        return result.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao atualizar transação');
        throw err;
      }
    },
    []
  );

  const remove = useCallback(async (id: string) => {
    try {
      setError(null);
      await api.deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      window.dispatchEvent(new Event('transactions-changed'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar transação');
      throw err;
    }
  }, []);

  return { transactions, loading, error, fetch, create, update, remove };
}

export function useSummary() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getSummary();
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar resumo');
    } finally {
      setLoading(false);
    }
  }, []);

  return { summary, loading, error, fetch };
}

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getBudgets();
      setBudgets(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar orçamentos');
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (category: string, monthly_limit: number) => {
    try {
      setError(null);
      const result = await api.createBudget(category, monthly_limit);
      setBudgets((prev) => [...prev, result.data]);
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar orçamento');
      throw err;
    }
  }, []);

  const update = useCallback(async (id: string, monthly_limit: number) => {
    try {
      setError(null);
      const result = await api.updateBudget(id, monthly_limit);
      setBudgets((prev) => prev.map((b) => (b.id === id ? result.data : b)));
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar orçamento');
      throw err;
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    try {
      setError(null);
      await api.deleteBudget(id);
      setBudgets((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar orçamento');
      throw err;
    }
  }, []);

  return { budgets, loading, error, fetch, create, update, remove };
}
