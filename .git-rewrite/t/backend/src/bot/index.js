const { Telegraf } = require('telegraf');
const { parseTransaction } = require('../services/aiParser');
const { findOrCreateUserByTelegramId, createTransaction, getSummary, getLastTransactions } = require('../services/transactionService');

const CATEGORY_EMOJI = {
  alimentação: '🍔',
  transporte: '🚗',
  moradia: '🏠',
  saúde: '💊',
  lazer: '🎮',
  educação: '📚',
  vestuário: '👕',
  serviços: '⚙️',
  investimento: '📈',
  outros: '📦',
};

const PAYMENT_LABEL = {
  pix: 'Pix',
  cartão_crédito: 'Cartão de Crédito',
  cartão_débito: 'Cartão de Débito',
  dinheiro: 'Dinheiro',
  transferência: 'Transferência',
  outro: 'Outro',
};

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function createBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error('❌ TELEGRAM_BOT_TOKEN não configurado');
    return null;
  }

  const bot = new Telegraf(token);

  bot.start((ctx) => {
    ctx.reply(
      `👋 Olá! Sou o *PorquIA*, seu assistente financeiro.\n\n` +
        `Basta me mandar uma mensagem descrevendo seu gasto ou receita:\n` +
        `• _"gastei 50 no mercado"_\n` +
        `• _"paguei 1200 de aluguel no pix"_\n` +
        `• _"recebi salário 5000"_\n\n` +
        `Comandos disponíveis:\n` +
        `/resumo — resumo do mês atual\n` +
        `/ultimas — últimas 5 transações`,
      { parse_mode: 'Markdown' }
    );
  });

  bot.help((ctx) => {
    ctx.reply(
      `*Como usar o PorquIA:*\n\n` +
        `Envie qualquer mensagem descrevendo uma transação:\n` +
        `• _"gastei 80 no uber"_\n` +
        `• _"comprei remédio por 45 reais"_\n` +
        `• _"paguei academia 100 no débito"_\n\n` +
        `/resumo — resumo financeiro do mês\n` +
        `/ultimas — últimas 5 transações`,
      { parse_mode: 'Markdown' }
    );
  });

  bot.command('resumo', async (ctx) => {
    try {
      const userId = await findOrCreateUserByTelegramId(ctx.chat.id);
      const summary = await getSummary(userId);

      const categorias = Object.entries(summary.porCategoria)
        .sort(([, a], [, b]) => b - a)
        .map(([cat, val]) => `  ${CATEGORY_EMOJI[cat] || '📦'} ${cat}: *${formatCurrency(val)}*`)
        .join('\n');

      const mes = new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

      ctx.reply(
        `📊 *Resumo de ${mes}*\n\n` +
          `💸 Despesas: *${formatCurrency(summary.totalDespesas)}*\n` +
          `💰 Receitas: *${formatCurrency(summary.totalReceitas)}*\n` +
          `${summary.saldo >= 0 ? '✅' : '⚠️'} Saldo: *${formatCurrency(summary.saldo)}*\n\n` +
          (categorias ? `*Por categoria:*\n${categorias}` : '_Nenhuma despesa registrada este mês._'),
        { parse_mode: 'Markdown' }
      );
    } catch (err) {
      console.error('Erro /resumo:', err);
      ctx.reply('❌ Erro ao buscar resumo. Tente novamente.');
    }
  });

  bot.command('ultimas', async (ctx) => {
    try {
      const userId = await findOrCreateUserByTelegramId(ctx.chat.id);
      const transactions = await getLastTransactions(userId, 5);

      if (!transactions.length) {
        return ctx.reply('_Nenhuma transação registrada ainda._', { parse_mode: 'Markdown' });
      }

      const lines = transactions.map((t) => {
        const emoji = t.type === 'receita' ? '💰' : CATEGORY_EMOJI[t.category] || '📦';
        const data = new Date(t.date).toLocaleDateString('pt-BR');
        return `${emoji} *${formatCurrency(t.amount)}* — ${t.description} _(${data})_`;
      });

      ctx.reply(`🗂 *Últimas transações:*\n\n${lines.join('\n')}`, { parse_mode: 'Markdown' });
    } catch (err) {
      console.error('Erro /ultimas:', err);
      ctx.reply('❌ Erro ao buscar transações. Tente novamente.');
    }
  });

  bot.on('text', async (ctx) => {
    const message = ctx.message.text;
    if (message.startsWith('/')) return;

    const thinking = await ctx.reply('⏳ Processando...');

    try {
      const parsed = await parseTransaction(message);

      if (parsed.error) {
        return ctx.telegram.editMessageText(ctx.chat.id, thinking.message_id, null, parsed.error);
      }

      const userId = await findOrCreateUserByTelegramId(ctx.chat.id);
      const saved = await createTransaction(userId, parsed);

      const emoji = parsed.type === 'receita' ? '💰' : CATEGORY_EMOJI[parsed.category] || '📦';
      const parcelasText = parsed.installments > 1 ? ` em *${parsed.installments}x*` : '';

      ctx.telegram.editMessageText(
        ctx.chat.id,
        thinking.message_id,
        null,
        `${emoji} *${parsed.type === 'receita' ? 'Receita' : 'Despesa'} registrada!*\n\n` +
          `💵 Valor: *${formatCurrency(parsed.amount)}*${parcelasText}\n` +
          `📝 Descrição: ${parsed.description}\n` +
          `🏷 Categoria: ${parsed.category}\n` +
          `💳 Pagamento: ${PAYMENT_LABEL[parsed.payment_method] || parsed.payment_method}\n\n` +
          `_Use /resumo para ver o saldo do mês._`,
        { parse_mode: 'Markdown' }
      );
    } catch (err) {
      console.error('Erro ao processar mensagem:', err);
      ctx.telegram.editMessageText(
        ctx.chat.id,
        thinking.message_id,
        null,
        '❌ Erro ao processar. Verifique se o backend está configurado corretamente.'
      );
    }
  });

  bot.catch((err, ctx) => {
    console.error(`Erro no bot para update ${ctx.updateType}:`, err);
  });

  return bot;
}

module.exports = { createBot };
