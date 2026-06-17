let app = null;

try {
  const { initializeApp, cert, getApps } = require('firebase-admin/app');

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').trim();

  if (getApps().length === 0) {
    if (clientEmail && privateKey && projectId) {
      app = initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
      console.log('✓ Firebase Admin inicializado com credenciais de serviço');
    } else if (projectId) {
      app = initializeApp({ projectId });
      console.log('⚠ Firebase Admin inicializado sem credenciais (modo restrito)');
    }
  } else {
    app = getApps()[0];
  }
} catch (err) {
  console.warn('⚠ Firebase Admin não disponível:', err.message);
  console.warn('   Backend rodará apenas com autenticação via Telegram (x-chat-id)');
  app = null;
}

module.exports = app;
