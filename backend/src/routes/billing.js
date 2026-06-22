const express = require('express');
const { createBilling, getBillingById, getPlan, PLANS } = require('../services/abacatePay');
const {
  getUserAccessStatus,
  setPendingBilling,
  activateSubscriptionByBillingId,
  activateSubscriptionByEmail,
} = require('../services/transactionService');

const router = express.Router();

// GET /api/billing/status — status da assinatura do usuário logado
router.get('/status', async (req, res) => {
  try {
    const status = await getUserAccessStatus(req.userId);
    res.json(status);
  } catch (err) {
    console.error('Erro GET /billing/status:', err);
    res.status(500).json({ error: 'Erro ao buscar status da assinatura' });
  }
});

// GET /api/billing/plans — preços (público para o usuário logado)
router.get('/plans', (req, res) => {
  res.json({
    monthly: { amount: PLANS.monthly.price / 100, name: PLANS.monthly.name },
    annual: { amount: PLANS.annual.price / 100, name: PLANS.annual.name },
  });
});

// POST /api/billing/checkout — cria cobrança PIX e devolve o link de pagamento
router.post('/checkout', async (req, res) => {
  try {
    const { plan } = req.body;
    if (!getPlan(plan)) {
      return res.status(400).json({ error: 'Plano inválido (use "monthly" ou "annual")' });
    }

    const status = await getUserAccessStatus(req.userId);
    const billing = await createBilling({
      plan,
      email: status.email,
      name: status.email,
      externalUserId: req.userId,
    });

    if (!billing.url) {
      return res.status(502).json({ error: 'Falha ao criar cobrança no Abacate Pay' });
    }

    await setPendingBilling(req.userId, billing.id, plan);

    res.json({
      payment_url: billing.url,
      amount: getPlan(plan).price / 100,
      plan,
    });
  } catch (err) {
    console.error('Erro POST /billing/checkout:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Erro ao criar cobrança' });
  }
});

// POST /api/billing/verify — fallback "Já paguei?": consulta a Abacate direto
router.post('/verify', async (req, res) => {
  try {
    let status = await getUserAccessStatus(req.userId);

    if (!status.active && status.pending_billing_id) {
      const billing = await getBillingById(status.pending_billing_id);
      const paid = billing && /paid/i.test(billing.status || '');
      if (paid) {
        await activateSubscriptionByBillingId(status.pending_billing_id);
        status = await getUserAccessStatus(req.userId);
      }
    }

    res.json(status);
  } catch (err) {
    console.error('Erro POST /billing/verify:', err);
    res.status(500).json({ error: 'Erro ao verificar pagamento' });
  }
});

// ── Webhook (SEM authMiddleware) ──────────────────────────────────
// Montado separadamente no server.js antes das rotas protegidas.
async function webhook(req, res) {
  try {
    // Validação: o Abacate envia ?webhookSecret=... na URL
    const secret = req.query.webhookSecret || req.headers['x-webhook-secret'];
    const configured = process.env.ABACATE_PAY_WEBHOOK_SECRET;

    if (!configured && process.env.NODE_ENV === 'production') {
      return res.status(500).json({ error: 'Webhook secret não configurado' });
    }

    if (configured && secret !== configured) {
      return res.status(401).json({ error: 'Webhook secret inválido' });
    }

    const event = req.body?.event;
    const billing = req.body?.data?.billing || req.body?.data || {};

    // Só nos interessa pagamento confirmado
    const isPaid = event === 'billing.paid' || /paid/i.test(billing.status || '');
    if (!isPaid) {
      return res.json({ received: true, ignored: event });
    }

    const billingId = billing.id || req.body?.data?.id;

    // 1) Caminho principal: mapeia pelo billing id pendente
    let activated = await activateSubscriptionByBillingId(billingId);

    // 2) Fallback: tenta pelo email + plano embutido nos metadados/produtos
    if (!activated) {
      const email =
        billing?.customer?.metadata?.email ||
        billing?.customer?.email ||
        billing?.metadata?.email;
      const plan =
        billing?.metadata?.plan ||
        (billing?.products?.[0]?.externalId === 'plan_annual' ? 'annual' : 'monthly');
      activated = await activateSubscriptionByEmail(email, plan);
    }

    if (!activated) {
      console.warn('Webhook billing.paid sem usuário correspondente:', billingId);
    }

    res.json({ received: true, activated: !!activated });
  } catch (err) {
    console.error('Erro no webhook do Abacate Pay:', err);
    res.status(500).json({ error: 'Erro ao processar webhook' });
  }
}

module.exports = router;
module.exports.webhook = webhook;
