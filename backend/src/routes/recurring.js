const express = require('express');
const { createFixedExpense, getRecurring, endRecurring, getUpcoming } = require('../services/transactionService');

const router = express.Router();

// Lista gastos fixos / recorrentes
router.get('/', async (req, res) => {
  try {
    const data = await getRecurring(req.userId);
    res.json({ data });
  } catch (err) {
    console.error('Erro GET /recurring:', err);
    res.status(500).json({ error: 'Erro ao buscar gastos fixos' });
  }
});

// Cria um gasto fixo (gera N meses)
router.post('/', async (req, res) => {
  try {
    const { description, amount, category, months, recurrence_type, start_date, end_date, occurrences } = req.body;
    if (!description || !amount) {
      return res.status(400).json({ error: 'description e amount são obrigatórios' });
    }
    const result = await createFixedExpense(req.userId, {
      description, amount, category, months, recurrence_type, start_date, end_date, occurrences,
    });
    res.status(201).json(result);
  } catch (err) {
    console.error('Erro POST /recurring:', err);
    res.status(500).json({ error: err.message });
  }
});

// Encerra um recorrente a partir de um mês (YYYY-MM)
router.post('/end', async (req, res) => {
  try {
    const { description, from_month } = req.body;
    if (!description) {
      return res.status(400).json({ error: 'description é obrigatória' });
    }
    const result = await endRecurring(req.userId, description, from_month);
    res.json(result);
  } catch (err) {
    console.error('Erro POST /recurring/end:', err);
    res.status(500).json({ error: err.message });
  }
});

// Próximos meses
router.get('/upcoming', async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const data = await getUpcoming(req.userId, months);
    res.json({ data });
  } catch (err) {
    console.error('Erro GET /recurring/upcoming:', err);
    res.status(500).json({ error: 'Erro ao buscar próximos meses' });
  }
});

module.exports = router;
