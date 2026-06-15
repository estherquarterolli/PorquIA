const axios = require('axios');
const { findOrCreateUserByTelegramId, findOrCreateUserByGoogleId } = require('../services/transactionService');

async function verifyFirebaseToken(idToken) {
  const apiKey = process.env.FIREBASE_API_KEY;
  if (!apiKey) throw new Error('FIREBASE_API_KEY não configurado');

  const { data } = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    { idToken }
  );

  return data.users[0]; // { localId, email, displayName, ... }
}

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const chatId = req.headers['x-chat-id'] || req.body?.chat_id;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const firebaseUser = await verifyFirebaseToken(token);
      req.userId = await findOrCreateUserByGoogleId(firebaseUser.localId, firebaseUser.email);
      return next();
    }

    if (chatId) {
      req.userId = await findOrCreateUserByTelegramId(chatId);
      req.chatId = chatId;
      return next();
    }

    return res.status(401).json({ error: 'Autenticação necessária' });
  } catch (err) {
    console.error('Erro no auth:', err?.response?.data || err.message);
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

module.exports = { authMiddleware };
