/**
 * bankService — Integração de contas bancárias / cartões via Puppeteer.
 *
 * ⚠️  LIMITAÇÕES IMPORTANTES (leia antes de usar em produção):
 *  - Puppeteer NÃO roda no Render free tier (precisa de Chromium + RAM).
 *    Rode local, ou suba um worker dedicado (Railway/Fly/VPS) só pro scraping.
 *  - Bancos reais (Nubank/Itaú/Bradesco) exigem 2FA / aprovação no app /
 *    CAPTCHA. Os adapters reais abaixo são STUBS: a estrutura está pronta,
 *    mas você precisa preencher os seletores e o fluxo de 2FA de cada banco.
 *  - O provider "demo" funciona 100% offline e serve pra testar todo o
 *    pipeline (conectar → importar → ver no dashboard) sem credencial real.
 *
 * Segurança: credenciais são cifradas (AES-256-GCM) com BANK_ENC_KEY antes
 * de irem ao banco de dados. NUNCA logue senhas.
 */

const crypto = require('crypto');
const supabase = require('../config/supabase');

// ── Criptografia de credenciais ─────────────────────────────────────
// BANK_ENC_KEY deve ser uma string forte (>= 32 chars) no .env.
function getKey() {
  const raw = process.env.BANK_ENC_KEY || '';
  if (raw.length < 16) {
    throw new Error('BANK_ENC_KEY ausente ou curta demais no .env (use >= 32 chars)');
  }
  // Deriva 32 bytes determinísticos a partir da chave do .env
  return crypto.createHash('sha256').update(raw).digest();
}

function encrypt(plainObj) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getKey(), iv);
  const data = Buffer.concat([
    cipher.update(JSON.stringify(plainObj), 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, data]).toString('base64');
}

function decrypt(b64) {
  const buf = Buffer.from(b64, 'base64');
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const data = buf.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', getKey(), iv);
  decipher.setAuthTag(tag);
  const out = Buffer.concat([decipher.update(data), decipher.final()]);
  return JSON.parse(out.toString('utf8'));
}

// ── Helper Puppeteer ────────────────────────────────────────────────
// Carregado de forma lazy pra não pesar o boot do servidor.
async function launchBrowser() {
  const puppeteer = require('puppeteer');
  return puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
}

/**
 * Cada adapter expõe:
 *   id, label, real (bool)
 *   async fetch(credentials) -> { account: {...}, transactions: [ {date, description, amount, type, payment_method} ] }
 * amount sempre POSITIVO; "type" diz despesa/receita.
 */
const adapters = {
  // ── DEMO: offline, determinístico, sempre funciona ───────────────
  demo: {
    id: 'demo',
    label: 'Banco Demo (teste)',
    real: false,
    async fetch() {
      const today = new Date();
      const mk = (daysAgo, description, amount, type, pm) => {
        const d = new Date(today);
        d.setDate(d.getDate() - daysAgo);
        return { date: d.toISOString(), description, amount, type, payment_method: pm };
      };
      return {
        account: { name: 'Conta Demo', balance: 2540.32, credit_limit: 5000, credit_used: 1180.5 },
        transactions: [
          mk(0, 'Uber', 32.9, 'despesa', 'cartão de crédito'),
          mk(1, 'Mercado Pão de Açúcar', 187.45, 'despesa', 'cartão de crédito'),
          mk(2, 'Salário', 4200, 'receita', 'transferência'),
          mk(3, 'Netflix', 44.9, 'despesa', 'cartão de crédito'),
          mk(5, 'Posto Ipiranga', 150.0, 'despesa', 'débito'),
          mk(8, 'Farmácia', 63.2, 'despesa', 'pix'),
        ],
      };
    },
  },

  // ── NUBANK (stub) ────────────────────────────────────────────────
  // Nubank exige aprovação no app (push) no 1º login. O caminho mais
  // confiável é a API GraphQL não-oficial (estilo pynubank), não scraping
  // de tela. Deixei o esqueleto Puppeteer; troque pela API se preferir.
  nubank: {
    id: 'nubank',
    label: 'Nubank',
    real: true,
    async fetch(credentials) {
      void credentials;
      throw new Error(
        'Adapter Nubank ainda não configurado: requer aprovação 2FA no app. ' +
          'Implemente o login (CPF/senha + push) em bankService.adapters.nubank.fetch.'
      );
      /* Exemplo de scaffold:
      const browser = await launchBrowser();
      try {
        const page = await browser.newPage();
        await page.goto('https://app.nubank.com.br/');
        // await page.type('#cpf', credentials.cpf);
        // await page.type('#password', credentials.password);
        // ... aguardar aprovação no app, navegar até extrato, extrair linhas ...
        // return { account, transactions };
      } finally {
        await browser.close();
      }
      */
    },
  },

  // ── ITAÚ (stub) ──────────────────────────────────────────────────
  itau: {
    id: 'itau',
    label: 'Itaú',
    real: true,
    async fetch(credentials) {
      void credentials;
      throw new Error(
        'Adapter Itaú ainda não configurado: preencha seletores de login e extrato ' +
          'em bankService.adapters.itau.fetch (cuidado com teclado virtual + 2FA).'
      );
    },
  },

  // ── BRADESCO (stub) ──────────────────────────────────────────────
  bradesco: {
    id: 'bradesco',
    label: 'Bradesco',
    real: true,
    async fetch(credentials) {
      void credentials;
      throw new Error(
        'Adapter Bradesco ainda não configurado: preencha seletores em ' +
          'bankService.adapters.bradesco.fetch (agência/conta + token).'
      );
    },
  },
};

function listProviders() {
  return Object.values(adapters).map((a) => ({ id: a.id, label: a.label, real: a.real }));
}

// ── Import de transações no DB (evita duplicar) ─────────────────────
async function importTransactions(userId, transactions) {
  if (!transactions?.length) return { imported: 0, skipped: 0 };

  // Busca transações recentes pra deduplicar por (data-dia + descrição + valor)
  const since = new Date();
  since.setMonth(since.getMonth() - 3);
  const { data: existing } = await supabase
    .from('transactions')
    .select('amount, description, date')
    .eq('user_id', userId)
    .gte('date', since.toISOString());

  const seen = new Set(
    (existing || []).map(
      (t) => `${t.date?.slice(0, 10)}|${(t.description || '').toLowerCase()}|${Number(t.amount)}`
    )
  );

  const rows = [];
  let skipped = 0;
  for (const t of transactions) {
    const key = `${t.date?.slice(0, 10)}|${(t.description || '').toLowerCase()}|${Number(t.amount)}`;
    if (seen.has(key)) {
      skipped++;
      continue;
    }
    seen.add(key);
    rows.push({
      user_id: userId,
      amount: Number(t.amount),
      description: t.description,
      category: t.category || 'outros',
      payment_method: t.payment_method || null,
      installments: t.installments || 1,
      current_installment: t.current_installment || 1,
      type: t.type || 'despesa',
      date: t.date,
    });
  }

  if (rows.length) {
    const { error } = await supabase.from('transactions').insert(rows);
    if (error) throw new Error(`Erro ao importar transações: ${error.message}`);
  }
  return { imported: rows.length, skipped };
}

// ── API pública do serviço ──────────────────────────────────────────

/** Conecta a um provider, importa transações e salva a conexão. */
async function connectBank(userId, provider, credentials = {}) {
  const adapter = adapters[provider];
  if (!adapter) throw new Error(`Provider desconhecido: ${provider}`);

  const result = await adapter.fetch(credentials);
  const importResult = await importTransactions(userId, result.transactions);

  // Salva/atualiza a conexão (credenciais cifradas só se o adapter for real)
  const row = {
    user_id: userId,
    provider,
    label: adapter.label,
    account_balance: result.account?.balance ?? null,
    credit_limit: result.account?.credit_limit ?? null,
    credit_used: result.account?.credit_used ?? null,
    last_synced_at: new Date().toISOString(),
    encrypted_credentials: adapter.real ? encrypt(credentials) : null,
  };

  const { data: saved, error } = await supabase
    .from('bank_connections')
    .upsert(row, { onConflict: 'user_id,provider' })
    .select('id, provider, label, account_balance, credit_limit, credit_used, last_synced_at')
    .single();

  if (error) throw new Error(`Erro ao salvar conexão: ${error.message}`);
  return { connection: saved, ...importResult };
}

/** Re-sincroniza uma conexão existente usando as credenciais salvas. */
async function syncBank(userId, connectionId) {
  const { data: conn, error } = await supabase
    .from('bank_connections')
    .select('*')
    .eq('id', connectionId)
    .eq('user_id', userId)
    .single();
  if (error || !conn) throw new Error('Conexão não encontrada');

  const credentials = conn.encrypted_credentials ? decrypt(conn.encrypted_credentials) : {};
  return connectBank(userId, conn.provider, credentials);
}

async function listConnections(userId) {
  const { data, error } = await supabase
    .from('bank_connections')
    .select('id, provider, label, account_balance, credit_limit, credit_used, last_synced_at')
    .eq('user_id', userId)
    .order('last_synced_at', { ascending: false });
  if (error) throw new Error(`Erro ao listar conexões: ${error.message}`);
  return data || [];
}

async function removeConnection(userId, connectionId) {
  const { error } = await supabase
    .from('bank_connections')
    .delete()
    .eq('id', connectionId)
    .eq('user_id', userId);
  if (error) throw new Error(`Erro ao remover conexão: ${error.message}`);
  return { removed: true };
}

module.exports = {
  adapters,
  launchBrowser,
  listProviders,
  connectBank,
  syncBank,
  listConnections,
  removeConnection,
  importTransactions,
};
