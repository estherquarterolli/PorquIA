const express = require('express');
const cors = require('cors');
require('dotenv').config();

const supabase = require('./config/supabase');
const { createBot } = require('./bot');
const { authMiddleware } = require('./middleware/auth');
const transactionsRouter = require('./routes/transactions');
const budgetsRouter = require('./routes/budgets');
const investmentsRouter = require('./routes/investments');
const subscriptionsRouter = require('./routes/subscriptions');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// Sprint 12 — request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${ms}ms`);
  });
  next();
});

// CORS tolerante: normaliza barra final / espaços e aceita múltiplas origens.
const normalize = (o) => o.trim().replace(/\/+$/, '');
const allowedOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map(normalize)
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // Sem origin = curl/health/server-to-server → libera
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(normalize(origin))) {
        return cb(null, true);
      }
      // Rede de segurança: libera qualquer deploy do projeto no Render
      // (assim funciona mesmo se CORS_ORIGIN estiver com valor errado/desatualizado).
      if (/\.onrender\.com$/.test(normalize(origin))) {
        return cb(null, true);
      }
      console.warn(`⚠️  CORS bloqueou origem: ${origin}. Permitidas: ${allowedOrigins.join(', ')}`);
      return cb(null, false);
    },
  })
);
app.use(express.json());

// ── Telegram bot ────────────────────────────────────────────────
// No Render (free) usamos WEBHOOK: o Telegram chama nosso backend
// (e isso acorda o serviço). Localmente caímos no long polling.
const bot = process.env.DISABLE_TELEGRAM === 'true' ? null : createBot();
const TELEGRAM_HOOK_PATH = '/telegram-webhook';
const telegramDomain = process.env.RENDER_EXTERNAL_URL || process.env.PUBLIC_URL;

if (bot && telegramDomain) {
  // Registra o handler do webhook antes das rotas/erro
  app.use(bot.webhookCallback(TELEGRAM_HOOK_PATH));
}

// Sprint 12 — health aprimorado
app.get('/health', async (req, res) => {
  try {
    const t0 = Date.now();
    const { error } = await supabase.from('users').select('id').limit(1);
    const dbMs = Date.now() - t0;
    if (error) throw error;
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime_s: Math.round(process.uptime()),
      database: { status: 'connected', latency_ms: dbMs },
    });
  } catch (err) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
    });
  }
});

app.use('/api/transactions',  authMiddleware, transactionsRouter);
app.use('/api/budgets',       authMiddleware, budgetsRouter);
app.use('/api/investments',   authMiddleware, investmentsRouter);
app.use('/api/subscriptions', authMiddleware, subscriptionsRouter);
app.use('/api/users',         authMiddleware, usersRouter);

// Sprint 12 — error handler global
app.use((err, req, res, _next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);

  if (!bot) {
    console.log('⏸️  Bot Telegram desativado');
    return;
  }

  if (telegramDomain) {
    // Produção (Render): configura o webhook
    const url = `${telegramDomain}${TELEGRAM_HOOK_PATH}`;
    bot.telegram
      .setWebhook(url, { drop_pending_updates: true })
      .then(() => console.log(`🤖 Webhook do Telegram configurado: ${url}`))
      .catch((err) => console.warn('⚠️  Falha ao configurar webhook:', err.message));
  } else {
    // Local: long polling (precisa remover qualquer webhook antigo antes)
    bot.telegram
      .deleteWebhook({ drop_pending_updates: true })
      .catch(() => {})
      .finally(() => {
        bot
          .launch({ dropPendingUpdates: true })
          .then(() => console.log('🤖 Bot Telegram iniciado (long polling)'))
          .catch((err) => console.warn('⚠️  Bot Telegram não pôde iniciar:', err.message));
      });
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  }
});

// Rede de segurança: nunca deixar uma rejeição não-tratada derrubar o servidor
process.on('unhandledRejection', (reason) => {
  console.warn('⚠️  Unhandled rejection (ignorado):', reason?.message || reason);
});
