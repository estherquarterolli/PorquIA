const express = require('express');
const supabase = require('../config/supabase');
const { parseTransaction } = require('../services/aiParser');
const { createTransaction, updateTransaction, getSummary, getLastTransactions, getMonthlyHistory } = require('../services/transactionService');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', req.userId)
      .order('date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    console.error('Erro GET /transactions:', err);
    res.status(500).json({ error: 'Erro ao buscar transações' });
  }
});

router.get('/monthly', async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const data = await getMonthlyHistory(req.userId, months);
    res.json(data);
  } catch (err) {
    console.error('Erro GET /monthly:', err);
    res.status(500).json({ error: 'Erro ao buscar histórico mensal' });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const summary = await getSummary(req.userId);
    res.json(summary);
  } catch (err) {
    console.error('Erro GET /summary:', err);
    res.status(500).json({ error: 'Erro ao buscar resumo' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'message obrigatória' });
    }

    const parsed = await parseTransaction(message);

    if (parsed.error) {
      return res.status(400).json({ error: parsed.error });
    }

    const transaction = await createTransaction(req.userId, parsed);
    res.status(201).json({ data: transaction });
  } catch (err) {
    console.error('Erro POST /transactions:', err);
    const detail = err?.response?.data?.error?.message || err?.message || 'erro desconhecido';
    res.status(500).json({ error: `Erro ao criar transação: ${detail}` });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { amount, description, category, type, payment_method } = req.body;
    const data = await updateTransaction(req.userId, req.params.id, {
      amount,
      description,
      category,
      type,
      payment_method,
    });
    res.json({ data });
  } catch (err) {
    console.error('Erro PUT /transactions/:id:', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    res.json({ data });
  } catch (err) {
    console.error('Erro DELETE /transactions/:id:', err);
    res.status(500).json({ error: 'Erro ao deletar transação' });
  }
});

module.exports = router;
