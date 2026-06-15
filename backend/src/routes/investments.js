const express = require('express');
const { getInvestmentSummary } = require('../services/transactionService');

const router = express.Router();

router.get('/summary', async (req, res) => {
  try {
    const data = await getInvestmentSummary(req.userId);
    res.json(data);
  } catch (err) {
    console.error('Erro GET /investments/summary:', err);
    res.status(500).json({ error: 'Erro ao buscar resumo de investimentos' });
  }
});

module.exports = router;
