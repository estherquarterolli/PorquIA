const express = require('express');
const supabase = require('../config/supabase');
const { getUserProfile, linkTelegramToUser, resetUserFinances } = require('../services/transactionService');

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
    // Verificar se o telegram_chat_id já está vinculado a outro usuário
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_chat_id', String(telegram_chat_id))
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingUser && existingUser.id !== req.userId) {
      return res.status(409).json({
        error: 'Este Telegram Chat ID já está vinculado a outra conta. Desconecte-o primeiro no outro dispositivo.'
      });
    }

    await linkTelegramToUser(req.userId, telegram_chat_id);
    res.json({ success: true });
  } catch (err) {
    console.error('Erro POST /users/link-telegram:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/reset', async (req, res) => {
  try {
    const result = await resetUserFinances(req.userId);
    res.json(result);
  } catch (err) {
    console.error('Erro POST /users/reset:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
