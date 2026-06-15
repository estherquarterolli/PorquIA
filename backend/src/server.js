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

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }));
app.use(express.json());

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

  if (process.env.DISABLE_TELEGRAM === 'true') {
    console.log('⏸️  Bot Telegram desativado (DISABLE_TELEGRAM=true)');
    return;
  }

  const bot = createBot();
  if (bot) {
    // bot.launch() rejeita se não conseguir conectar à API do Telegram
    // (ex.: proxy corporativo com inspeção SSL). Isso NÃO pode derrubar a API.
    bot
      .launch({ dropPendingUpdates: true })
      .then(() => console.log('🤖 Bot Telegram iniciado (long polling)'))
      .catch((err) => {
        console.warn('⚠️  Bot Telegram não pôde iniciar:', err.message);
        console.warn('   A API REST continua funcionando normalmente.');
      });
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  }
});

// Rede de segurança: nunca deixar uma rejeição não-tratada derrubar o servidor
process.on('unhandledRejection', (reason) => {
  console.warn('⚠️  Unhandled rejection (ignorado):', reason?.message || reason);
});
