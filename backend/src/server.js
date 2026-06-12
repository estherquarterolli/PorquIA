const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { createBot } = require('./bot');
const { authMiddleware } = require('./middleware/auth');
const transactionsRouter = require('./routes/transactions');
const budgetsRouter = require('./routes/budgets');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/transactions', authMiddleware, transactionsRouter);
app.use('/api/budgets', authMiddleware, budgetsRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);

  const bot = createBot();
  if (bot) {
    bot.launch({ dropPendingUpdates: true });
    console.log('🤖 Bot Telegram iniciado (long polling)');

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  }
});
