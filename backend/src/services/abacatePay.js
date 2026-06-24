const axios = require('axios');

// ============================================
// 💳 Abacate Pay — wrapper da API de cobrança (PIX)
// Docs: https://docs.abacatepay.com
// ============================================

const BASE_URL = 'https://api.abacatepay.com/v1';

// Planos do PorquIA. `price` em CENTAVOS (exigência da API).
const PLANS = {
  monthly: { id: 'plan_monthly', name: 'PorquIA Mensal', price: 1990, days: 30 },
  annual: { id: 'plan_annual', name: 'PorquIA Anual', price: 17990, days: 365 },
};

function getPlan(plan) {
  return PLANS[plan] || null;
}

function client() {
  const apiKey = process.env.ABACATE_PAY_API_KEY;
  if (!apiKey) throw new Error('ABACATE_PAY_API_KEY não configurado');
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    timeout: 15000,
  });
}

// Cria uma cobrança PIX única (one-time) para o plano escolhido.
// Retorna { id, url } — `url` é a página de checkout hospedada pela Abacate.
async function createBilling({ plan, email, name, externalUserId }) {
  const p = getPlan(plan);
  if (!p) throw new Error('Plano inválido');

  const frontend = (process.env.FRONTEND_URL || 'http://localhost:3001').replace(/\/+$/, '');

  const payload = {
    frequency: 'ONE_TIME',
    methods: ['PIX'],
    products: [
      {
        externalId: p.id,
        name: p.name,
        description: `Assinatura ${p.name}`,
        quantity: 1,
        price: p.price,
      },
    ],
    returnUrl: `${frontend}/paywall`,
    completionUrl: `${frontend}/checkout/success`,
    customer: {
      email,
      name: name || email,
    },
    // metadata ajuda a reconciliar no webhook (além do billing id)
    metadata: {
      externalId: externalUserId,
      plan,
    },
  };

  const { data } = await client().post('/billing/create', payload);
  const billing = data?.data || data;
  return { id: billing?.id, url: billing?.url, raw: billing };
}

// Busca uma cobrança específica pelo id (a API expõe /billing/list).
// Usado no fallback "Já paguei? Verificar" quando o webhook ainda não chegou.
async function getBillingById(billingId) {
  if (!billingId) return null;
  try {
    const { data } = await client().get('/billing/list');
    const list = data?.data || data || [];
    return list.find((b) => b.id === billingId) || null;
  } catch (err) {
    console.warn('Abacate getBillingById falhou:', err?.response?.data || err.message);
    return null;
  }
}

module.exports = { PLANS, getPlan, createBilling, getBillingById };
