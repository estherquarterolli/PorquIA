const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const supabase = require('../config/supabase');

const router = express.Router();

// SQL necessário no Supabase (executar uma vez se ainda não existirem):
// ALTER TABLE users
//   ADD COLUMN IF NOT EXISTS stripe_customer_id   VARCHAR(255) UNIQUE,
//   ADD COLUMN IF NOT EXISTS subscription_id      VARCHAR(255),
//   ADD COLUMN IF NOT EXISTS plan                 VARCHAR(30) DEFAULT 'trial',
//   ADD COLUMN IF NOT EXISTS trial_ends_at        TIMESTAMP DEFAULT (NOW() + INTERVAL '7 days'),
//   ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMP,
//   ADD COLUMN IF NOT EXISTS pending_billing_id   VARCHAR(255),
//   ADD COLUMN IF NOT EXISTS pending_plan         VARCHAR(20);

// GET /api/billing/status
router.get('/status', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('email, plan, trial_ends_at, subscription_ends_at, pending_billing_id, pending_plan')
      .eq('id', req.userId)
      .single();

    if (error) throw error;

    const now = Date.now();
    const active =
      data.plan === 'whitelisted' ||
      (data.plan === 'trial' && !!data.trial_ends_at && new Date(data.trial_ends_at).getTime() > now) ||
      ((data.plan === 'monthly' || data.plan === 'annual') &&
        !!data.subscription_ends_at &&
        new Date(data.subscription_ends_at).getTime() > now);

    res.json({
      email: data.email,
      plan: data.plan || 'inactive',
      trial_ends_at: data.trial_ends_at,
      subscription_ends_at: data.subscription_ends_at,
      pending_billing_id: data.pending_billing_id,
      pending_plan: data.pending_plan,
      active,
    });
  } catch (err) {
    console.error('Erro GET /billing/status:', err);
    res.status(500).json({ error: 'Erro ao buscar status da assinatura' });
  }
});

// GET /api/billing/plans
router.get('/plans', (req, res) => {
  res.json({
    monthly: { amount: 19.9, name: 'Pro Mensal' },
    annual: { amount: 179.9, name: 'Pro Anual' },
  });
});

// POST /api/billing/checkout — cria sessão de pagamento Stripe
router.post('/checkout', async (req, res) => {
  try {
    const { plan = 'monthly' } = req.body;
    const priceId =
      plan === 'annual'
        ? process.env.STRIPE_PRICE_ID_ANNUAL
        : process.env.STRIPE_PRICE_ID_MONTHLY;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID não configurado para este plano' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('email, stripe_customer_id')
      .eq('id', req.userId)
      .single();

    if (error) throw error;

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

    const sessionParams = {
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${frontendUrl}/planos?sucesso=true`,
      cancel_url: `${frontendUrl}/planos`,
      metadata: { user_id: req.userId, plan },
    };

    if (user.stripe_customer_id) {
      sessionParams.customer = user.stripe_customer_id;
    } else {
      sessionParams.customer_email = user.email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    res.json({ url: session.url });
  } catch (err) {
    console.error('Erro POST /billing/checkout:', err);
    res.status(500).json({ error: 'Erro ao criar sessão de pagamento' });
  }
});

// POST /api/billing/portal — portal de gerenciamento Stripe
router.post('/portal', async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', req.userId)
      .single();

    if (error || !user?.stripe_customer_id) {
      return res.status(400).json({ error: 'Nenhuma assinatura Stripe encontrada' });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${frontendUrl}/planos`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Erro POST /billing/portal:', err);
    res.status(500).json({ error: 'Erro ao abrir portal de assinatura' });
  }
});

// Webhook Stripe — registrado em server.js com raw body ANTES do express.json
async function stripeWebhookHandler(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook Stripe — assinatura inválida:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      const plan = session.metadata?.plan || 'monthly';

      if (userId && session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription);
        const endsAt = new Date(sub.current_period_end * 1000).toISOString();
        await supabase.from('users').update({
          stripe_customer_id: session.customer,
          subscription_id: session.subscription,
          plan,
          subscription_ends_at: endsAt,
          pending_billing_id: null,
          pending_plan: null,
        }).eq('id', userId);
        console.log(`✅ Stripe: assinatura ${plan} ativada para user ${userId}`);
      }
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const sub = event.data.object;
      const { data: users } = await supabase
        .from('users')
        .select('id, plan')
        .eq('stripe_customer_id', sub.customer);

      if (users?.length) {
        const isActive = sub.status === 'active' || sub.status === 'trialing';
        const endsAt = new Date(sub.current_period_end * 1000).toISOString();
        await supabase.from('users').update({
          plan: isActive ? users[0].plan : 'inactive',
          subscription_ends_at: endsAt,
        }).eq('id', users[0].id);
        console.log(`🔄 Stripe: ${sub.status} para customer ${sub.customer}`);
      }
    }
  } catch (err) {
    console.error('Erro ao processar webhook Stripe:', err);
  }

  res.json({ received: true });
}

module.exports = { billingRouter: router, stripeWebhookHandler };
