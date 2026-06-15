const express = require('express');
const { detectSubscriptions } = require('../services/transactionService');

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

module.exports = router;
