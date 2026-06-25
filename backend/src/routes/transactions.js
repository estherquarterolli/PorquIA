const express = require('express');
const rateLimit = require('express-rate-limit');
const supabase = require('../config/supabase');
const { parseTransaction } = require('../services/aiParser');
const { createTransaction, updateTransaction, getSummary, getLastTransactions, getMonthlyHistory } = require('../services/transactionService');

const router = express.Router();

// Limiter para IA (POST /transactions chama OpenAI/Groq)
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 30, // 30 requisições por IP
  standardHeaders: true,
  skip: (req) => !req.ip,
});

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

router.post('/preview', aiLimiter, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'message obrigatória' });
    }

    const parsed = await parseTransaction(message);
    if (parsed.error) {
      return res.status(400).json({ error: parsed.error });
    }

    res.json(parsed);
  } catch (err) {
    console.error('Erro POST /transactions/preview:', err);
    const detail = err?.response?.data?.error?.message || err?.message || 'erro desconhecido';
    res.status(500).json({ error: `Erro ao pré-processar transação: ${detail}` });
  }
});

router.post('/', aiLimiter, async (req, res) => {
  try {
    const { message, installments, current_installment } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'message obrigatória' });
    }

    const parsed = await parseTransaction(message);
    if (parsed.error) {
      return res.status(400).json({ error: parsed.error });
    }

    if (installments !== undefined) {
      parsed.installments = Number(installments);
    }
    if (current_installment !== undefined) {
      parsed.current_installment = Number(current_installment);
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
    const { amount, description, category, type, payment_method, installments, current_installment } = req.body;

    if (amount !== undefined && (isNaN(Number(amount)) || Number(amount) <= 0)) {
      return res.status(400).json({ error: 'Valor inválido. Informe um valor maior que zero.' });
    }

    const { data: tx } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();

    if (!tx) return res.status(404).json({ error: 'Transação não encontrada' });

    const baseDesc = (description || tx.description).replace(/\s*\(\d+\/\d+\)$/, '');
    const isParcelado = (installments && installments > 1 && current_installment) || tx.installments > 1;

    if (isParcelado) {
      const tot = installments || tx.installments;
      const cur = current_installment || 1;
      const perAmount = amount !== undefined ? Number(amount) : tx.amount;

      // Atualiza todas as parcelas existentes com o novo valor/categoria/método
      const { data: irmans } = await supabase
        .from('transactions')
        .select('id, description, date')
        .eq('user_id', req.userId)
        .ilike('description', `${baseDesc} (%/%)`);

      if (irmans?.length) {
        await supabase
          .from('transactions')
          .update({
            amount: perAmount,
            ...(category && { category }),
            ...(type && { type }),
            ...(payment_method && { payment_method }),
            installments: tot,
          })
          .in('id', irmans.map((r) => r.id));
      }

      // Deleta parcelas futuras para recriar com nova numeração
      const today = new Date();
      today.setDate(1);
      await supabase
        .from('transactions')
        .delete()
        .eq('user_id', req.userId)
        .ilike('description', `${baseDesc} (%/%)`)
        .gte('date', today.toISOString())
        .neq('id', req.params.id);

      // Atualiza parcela atual
      const data = await updateTransaction(req.userId, req.params.id, {
        amount: perAmount,
        description: `${baseDesc} (${cur}/${tot})`,
        category, type, payment_method, installments: tot,
      });

      // Recria parcelas futuras
      const rows = [];
      for (let i = cur + 1; i <= tot; i++) {
        const d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() + (i - cur));
        rows.push({
          user_id: req.userId,
          amount: perAmount,
          description: `${baseDesc} (${i}/${tot})`,
          category: category || tx.category,
          payment_method: payment_method || tx.payment_method,
          type: type || tx.type,
          installments: tot,
          date: d.toISOString(),
        });
      }
      if (rows.length) await supabase.from('transactions').insert(rows);

      return res.json({ data });
    }

    const data = await updateTransaction(req.userId, req.params.id, {
      amount, description, category, type, payment_method,
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
