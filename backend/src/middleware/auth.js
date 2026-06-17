const app = require('../config/firebase-admin');
const { findOrCreateUserByTelegramId, findOrCreateUserByGoogleId } = require('../services/transactionService');

async function verifyFirebaseToken(idToken) {
  if (!app) {
    throw new Error('Firebase Admin não disponível');
  }
  const { getAuth } = require('firebase-admin/auth');
  const decoded = await getAuth(app).verifyIdToken(idToken);
  return { localId: decoded.uid, email: decoded.email };
}

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const chatId = req.headers['x-chat-id'] || req.body?.chat_id;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const firebaseUser = await verifyFirebaseToken(token);
        req.userId = await findOrCreateUserByGoogleId(firebaseUser.localId, firebaseUser.email);
        return next();
      } catch (err) {
        console.error('Erro ao verificar token Firebase:', err.message);
        return res.status(401).json({ error: 'Token inválido ou expirado' });
      }
    }

    if (chatId) {
      req.userId = await findOrCreateUserByTelegramId(chatId);
      req.chatId = chatId;
      return next();
    }

    return res.status(401).json({ error: 'Autenticação necessária' });
  } catch (err) {
    console.error('Erro no auth middleware:', err.message);
    res.status(401).json({ error: 'Erro de autenticação' });
  }
}

module.exports = { authMiddleware };
