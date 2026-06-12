const supabase = require('../config/supabase');

async function findOrCreateUserByTelegramId(chatId) {
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('telegram_chat_id', String(chatId))
    .single();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from('users')
    .insert({ telegram_chat_id: String(chatId), email: `telegram_${chatId}@porquia.app` })
    .select('id')
    .single();

  if (error) throw new Error(`Erro ao criar usuário: ${error.message}`);
  return created.id;
}

async function createTransaction(userId, parsed) {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      amount: parsed.amount,
      description: parsed.description,
      category: parsed.category,
      payment_method: parsed.payment_method,
      installments: parsed.installments || 1,
      type: parsed.type || 'despesa',
    })
    .select()
    .single();

  if (error) throw new Error(`Erro ao salvar transação: ${error.message}`);
  return data;
}

async function getSummary(userId) {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('transactions')
    .select('amount, category, type')
    .eq('user_id', userId)
    .gte('date', startOfMonth.toISOString());

  if (error) throw new Error(`Erro ao buscar resumo: ${error.message}`);

  const despesas = data.filter((t) => t.type === 'despesa');
  const receitas = data.filter((t) => t.type === 'receita');

  const totalDespesas = despesas.reduce((sum, t) => sum + Number(t.amount), 0);
  const totalReceitas = receitas.reduce((sum, t) => sum + Number(t.amount), 0);

  const porCategoria = despesas.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    return acc;
  }, {});

  return { totalDespesas, totalReceitas, saldo: totalReceitas - totalDespesas, porCategoria };
}

async function getLastTransactions(userId, limit = 5) {
  const { data, error } = await supabase
    .from('transactions')
    .select('amount, description, category, type, date')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Erro ao buscar transações: ${error.message}`);
  return data;
}

module.exports = { findOrCreateUserByTelegramId, createTransaction, getSummary, getLastTransactions };
