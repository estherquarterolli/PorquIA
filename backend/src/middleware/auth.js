const { findOrCreateUserByTelegramId } = require('../services/transactionService');

async function authMiddleware(req, res, next) {
  try {
    const chatId = req.headers['x-chat-id'] || req.body?.chat_id;

    if (!chatId) {
      return res.status(401).json({ error: 'chat_id obrigatório (header x-chat-id ou body)' });
    }

    const userId = await findOrCreateUserByTelegramId(chatId);
    req.userId = userId;
    req.chatId = chatId;

    next();
  } catch (err) {
    console.error('Erro no auth:', err);
    res.status(500).json({ error: 'Erro de autenticação' });
  }
}

module.exports = { authMiddleware };
