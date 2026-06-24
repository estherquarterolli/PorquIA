const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const supabase = require('./config/supabase');
const { createBot } = require('./bot');
const { authMiddleware } = require('./middleware/auth');
const { requireActivePlan } = require('./middleware/requirePlan');
const transactionsRouter = require('./routes/transactions');
const budgetsRouter = require('./routes/budgets');
const investmentsRouter = require('./routes/investments');
const subscriptionsRouter = require('./routes/subscriptions');
const usersRouter = require('./routes/users');
const recurringRouter = require('./routes/recurring');
const banksRouter = require('./routes/banks');
const { billingRouter, stripeWebhookHandler } = require('./routes/billing');

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

// CORS: normaliza barra final / espaços e aceita múltiplas origens
const normalize = (o) => o.trim().replace(/\/+$/, '');
const defaultOrigin = process.env.NODE_ENV === 'production' ? '' : '*';
const allowedOrigins = (process.env.CORS_ORIGIN || defaultOrigin)
  .split(',')
  .map(normalize)
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(normalize(origin))) {
        return cb(null, true);
      }
      // Libera deploys no Render e Vercel automaticamente
      if (/\.onrender\.com$/.test(normalize(origin)) || /\.vercel\.app$/.test(normalize(origin))) {
        return cb(null, true);
      }
      console.warn(`⚠️  CORS bloqueou origem: ${origin}. Permitidas: ${allowedOrigins.join(', ')}`);
      return cb(null, false);
    },
  })
);

// Limite global reduzido; apenas /api/banks/import usa 5mb
app.use(express.json({ limit: '100kb' }));

// Rate limiters
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  skip: (req) => !req.ip,
});

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  skip: (req) => !req.ip,
});

app.use(globalLimiter);

// ── Telegram bot ────────────────────────────────────────────────
const bot = process.env.DISABLE_TELEGRAM === 'true' ? null : createBot();
const TELEGRAM_HOOK_PATH = '/telegram-webhook';
const railwayDomain = process.env.RAILWAY_PUBLIC_DOMAIN;
const telegramDomain =
  process.env.RENDER_EXTERNAL_URL ||
  (railwayDomain ? `https://${railwayDomain}` : null) ||
  process.env.PUBLIC_URL;

if (bot && telegramDomain) {
  app.use(bot.webhookCallback(TELEGRAM_HOOK_PATH));
}

// Sprint 12 — health aprimorado
app.get('/health', async (req, res) => {
  let dbStatus = 'unknown';
  let dbMs = null;
  try {
    const t0 = Date.now();
    const { error } = await supabase.from('users').select('id').limit(1);
    dbMs = Date.now() - t0;
    dbStatus = error ? 'error' : 'connected';
  } catch {
    dbStatus = 'error';
  }
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime_s: Math.round(process.uptime()),
    database: { status: dbStatus, latency_ms: dbMs },
  });
});

// Stripe webhook — raw body ANTES do express.json global
app.post('/api/billing/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);

// Billing (status/checkout/verify) — exige login, mas NÃO exige plano ativo
app.use('/api/billing', authMiddleware, billingRouter);

// Rotas protegidas — exigem login E acesso ativo (trial/assinatura/whitelist)
app.use('/api/transactions',  authMiddleware, requireActivePlan, transactionsRouter);
app.use('/api/budgets',       authMiddleware, requireActivePlan, budgetsRouter);
app.use('/api/investments',   authMiddleware, requireActivePlan, investmentsRouter);
app.use('/api/subscriptions', authMiddleware, requireActivePlan, subscriptionsRouter);
app.use('/api/users',         authMiddleware, requireActivePlan, usersRouter);
app.use('/api/recurring',     authMiddleware, requireActivePlan, recurringRouter);
app.use('/api/banks',         authMiddleware, requireActivePlan, banksRouter);

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
    const url = `${telegramDomain}${TELEGRAM_HOOK_PATH}`;
    bot.telegram
      .setWebhook(url, { drop_pending_updates: true })
      .then(() => console.log(`🤖 Webhook do Telegram configurado: ${url}`))
      .catch((err) => console.warn('⚠️  Falha ao configurar webhook:', err.message));
  } else {
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

process.on('unhandledRejection', (reason) => {
  console.warn('⚠️  Unhandled rejection (ignorado):', reason?.message || reason);
});
