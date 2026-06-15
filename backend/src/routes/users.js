const express = require('express');
const { getUserProfile, linkTelegramToUser } = require('../services/transactionService');

const router = express.Router();

router.get('/profile', async (req, res) => {
  try {
    const data = await getUserProfile(req.userId);
    res.json(data);
  } catch (err) {
    console.error('Erro GET /users/profile:', err);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
});

router.post('/link-telegram', async (req, res) => {
  const { telegram_chat_id } = req.body;
  if (!telegram_chat_id) {
    return res.status(400).json({ error: 'telegram_chat_id obrigatório' });
  }
  try {
    await linkTelegramToUser(req.userId, telegram_chat_id);
    res.json({ success: true });
  } catch (err) {
    console.error('Erro POST /users/link-telegram:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
