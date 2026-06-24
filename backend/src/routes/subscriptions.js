const express = require('express');
const { detectSubscriptions, createSubscription } = require('../services/transactionService');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await detectSubscriptions(req.userId);
    res.json(data);
  } catch (err) {
    console.error('Erro GET /subscriptions:', err);
    res.status(500).json({ error: 'Erro ao detectar assinaturas' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { description, amount, category, recurrence_type, start_date, end_date, occurrences, months } = req.body;
    if (!description || amount === undefined) {
      return res.status(400).json({ error: 'description e amount são obrigatórios' });
    }

    const result = await createSubscription(req.userId, {
      description,
      amount,
      category,
      recurrence_type,
      start_date,
      end_date,
      occurrences,
      months,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error('Erro POST /subscriptions:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
