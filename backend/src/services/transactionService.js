const supabase = require('../config/supabase');

async function findOrCreateUserByGoogleId(googleId, email) {
  // Tenta achar primeiro (caminho comum após o 1º login)
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('google_id', googleId)
    .maybeSingle();

  if (existing) return existing.id;

  // upsert atômico: seguro contra requisições paralelas no 1º login
  // (evita "duplicate key" quando várias chamadas criam o usuário ao mesmo tempo)
  const { data: created, error } = await supabase
    .from('users')
    .upsert({ google_id: googleId, email }, { onConflict: 'google_id' })
    .select('id')
    .single();

  if (error) throw new Error(`Erro ao criar usuário: ${error.message}`);
  return created.id;
}

async function findOrCreateUserByTelegramId(chatId) {
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('telegram_chat_id', String(chatId))
    .maybeSingle();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from('users')
    .upsert(
      { telegram_chat_id: String(chatId), email: `telegram_${chatId}@porquia.app` },
      { onConflict: 'telegram_chat_id' }
    )
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

async function updateTransaction(userId, id, fields) {
  const allowed = {};
  if (fields.amount !== undefined) allowed.amount = fields.amount;
  if (fields.description !== undefined) allowed.description = fields.description;
  if (fields.category !== undefined) allowed.category = fields.category;
  if (fields.type !== undefined) allowed.type = fields.type;
  if (fields.payment_method !== undefined) allowed.payment_method = fields.payment_method;

  if (Object.keys(allowed).length === 0) {
    throw new Error('Nenhum campo para atualizar');
  }

  const { data, error } = await supabase
    .from('transactions')
    .update(allowed)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error || !data) throw new Error(error?.message || 'Transação não encontrada');
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

async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, google_id, telegram_chat_id, created_at')
    .eq('id', userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function linkTelegramToUser(userId, telegramChatId) {
  const chatId = String(telegramChatId);

  // O bot pode ter criado uma conta "só Telegram" com esse chat id.
  // Como telegram_chat_id é único, precisamos mesclar essa conta na atual
  // antes de vincular — senão o update viola a constraint de unicidade.
  const { data: tgUser } = await supabase
    .from('users')
    .select('id')
    .eq('telegram_chat_id', chatId)
    .maybeSingle();

  if (tgUser && tgUser.id !== userId) {
    // Move os dados da conta do Telegram para a conta atual (Google)
    await supabase.from('transactions').update({ user_id: userId }).eq('user_id', tgUser.id);
    await supabase.from('budgets').update({ user_id: userId }).eq('user_id', tgUser.id);
    // Remove a conta órfã para liberar o chat id
    await supabase.from('users').delete().eq('id', tgUser.id);
  } else if (tgUser && tgUser.id === userId) {
    return; // já está vinculado a esta conta
  }

  const { error } = await supabase
    .from('users')
    .update({ telegram_chat_id: chatId })
    .eq('id', userId);

  if (error) throw new Error(`Erro ao vincular Telegram: ${error.message}`);
}

async function detectSubscriptions(userId) {
  const since = new Date();
  since.setFullYear(since.getFullYear() - 1);

  const { data, error } = await supabase
    .from('transactions')
    .select('amount, description, date, category')
    .eq('user_id', userId)
    .eq('type', 'despesa')
    .gte('date', since.toISOString())
    .order('date', { ascending: true });

  if (error) throw new Error(error.message);

  // Agrupa por descrição normalizada + valor arredondado
  const grouped = {};
  for (const tx of data) {
    const key = `${tx.description.toLowerCase().trim()}||${Math.round(Number(tx.amount))}`;
    if (!grouped[key]) {
      grouped[key] = { description: tx.description, category: tx.category, amount: Number(tx.amount), dates: [] };
    }
    grouped[key].dates.push(new Date(tx.date));
  }

  const subscriptions = [];

  for (const group of Object.values(grouped)) {
    if (group.dates.length < 2) continue;

    group.dates.sort((a, b) => a.getTime() - b.getTime());

    const intervals = [];
    for (let i = 1; i < group.dates.length; i++) {
      intervals.push((group.dates[i].getTime() - group.dates[i - 1].getTime()) / 86400000);
    }

    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;

    let frequency = null;
    let expectedInterval = null;
    if (avg >= 5 && avg <= 9)       { frequency = 'semanal';   expectedInterval = 7; }
    else if (avg >= 12 && avg <= 18) { frequency = 'quinzenal'; expectedInterval = 14; }
    else if (avg >= 25 && avg <= 35) { frequency = 'mensal';    expectedInterval = 30; }
    else if (avg >= 355 && avg <= 375) { frequency = 'anual';   expectedInterval = 365; }

    if (!frequency) continue;

    const stdDev = Math.sqrt(
      intervals.reduce((s, i) => s + (i - avg) ** 2, 0) / intervals.length
    );
    if (stdDev > expectedInterval * 0.25) continue;

    const lastCharge = group.dates[group.dates.length - 1];
    const nextCharge = new Date(lastCharge.getTime() + expectedInterval * 86400000);

    subscriptions.push({
      description: group.description,
      category: group.category,
      amount: parseFloat(group.amount.toFixed(2)),
      frequency,
      occurrences: group.dates.length,
      last_charge: lastCharge.toISOString(),
      next_charge: nextCharge.toISOString(),
      total_spent: parseFloat((group.dates.length * group.amount).toFixed(2)),
    });
  }

  return subscriptions.sort((a, b) => b.amount - a.amount);
}

async function getInvestmentSummary(userId) {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const { data, error } = await supabase
    .from('transactions')
    .select('amount, date, description')
    .eq('user_id', userId)
    .eq('category', 'investimento')
    .eq('type', 'despesa')
    .gte('date', startOfYear.toISOString())
    .order('date', { ascending: false });

  if (error) throw new Error(error.message);

  const totalAno = data.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalMes = data
    .filter((tx) => new Date(tx.date) >= startOfMonth)
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const monthMap = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthMap[key] = { month: key, label: d.toLocaleDateString('pt-BR', { month: 'short' }), total: 0 };
  }

  for (const tx of data) {
    const d = new Date(tx.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (monthMap[key]) monthMap[key].total += Number(tx.amount);
  }

  const historico = Object.values(monthMap).map((m) => ({
    ...m,
    total: parseFloat(m.total.toFixed(2)),
  }));

  const mesesComAporte = historico.filter((m) => m.total > 0);
  const mediaMensal =
    mesesComAporte.length > 0
      ? mesesComAporte.reduce((sum, m) => sum + m.total, 0) / mesesComAporte.length
      : 0;

  return {
    totalMes: parseFloat(totalMes.toFixed(2)),
    totalAno: parseFloat(totalAno.toFixed(2)),
    mediaMensal: parseFloat(mediaMensal.toFixed(2)),
    historico,
    ultimosAportes: data.slice(0, 10),
  };
}

async function getBudgetStatus(userId) {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [budgetsResult, txResult] = await Promise.all([
    supabase.from('budgets').select('*').eq('user_id', userId).order('category'),
    supabase
      .from('transactions')
      .select('amount, category')
      .eq('user_id', userId)
      .eq('type', 'despesa')
      .gte('date', startOfMonth.toISOString()),
  ]);

  if (budgetsResult.error) throw new Error(budgetsResult.error.message);
  if (txResult.error) throw new Error(txResult.error.message);

  const spentByCategory = {};
  for (const tx of txResult.data) {
    spentByCategory[tx.category] = (spentByCategory[tx.category] || 0) + Number(tx.amount);
  }

  return budgetsResult.data.map((budget) => {
    const spent = parseFloat((spentByCategory[budget.category] || 0).toFixed(2));
    const percent = budget.monthly_limit > 0 ? (spent / budget.monthly_limit) * 100 : 0;
    const status = percent >= 100 ? 'over' : percent >= 80 ? 'warning' : 'ok';
    return { ...budget, spent, percent: parseFloat(percent.toFixed(1)), status };
  });
}

async function getMonthlyHistory(userId, months = 6) {
  const since = new Date();
  since.setMonth(since.getMonth() - months + 1);
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('transactions')
    .select('amount, type, date')
    .eq('user_id', userId)
    .gte('date', since.toISOString())
    .order('date', { ascending: true });

  if (error) throw new Error(`Erro ao buscar histórico: ${error.message}`);

  const monthMap = {};
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('pt-BR', { month: 'short' });
    monthMap[key] = { month: key, label, despesas: 0, receitas: 0 };
  }

  for (const tx of data) {
    const d = new Date(tx.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!monthMap[key]) continue;
    if (tx.type === 'despesa') monthMap[key].despesas += Number(tx.amount);
    else monthMap[key].receitas += Number(tx.amount);
  }

  return Object.values(monthMap).map((m) => ({
    ...m,
    despesas: parseFloat(m.despesas.toFixed(2)),
    receitas: parseFloat(m.receitas.toFixed(2)),
  }));
}

module.exports = { findOrCreateUserByGoogleId, findOrCreateUserByTelegramId, createTransaction, updateTransaction, getSummary, getLastTransactions, getMonthlyHistory, getBudgetStatus, getInvestmentSummary, detectSubscriptions, getUserProfile, linkTelegramToUser };
