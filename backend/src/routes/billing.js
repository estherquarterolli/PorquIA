const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const supabase = require('../config/supabase');

const router = express.Router();

// SQL necessário no Supabase (executar uma vez):
// ALTER TABLE users
//   ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255) UNIQUE,
//   ADD COLUMN IF NOT EXISTS subscription_id VARCHAR(255),
//   ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR(20) DEFAULT 'free',
//   ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(30) DEFAULT 'inactive',
//   ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMP;

// GET /api/billing/status
router.get('/status', async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('subscription_plan, subscription_status, subscription_current_period_end')
      .eq('id', req.userId)
      .single();

    if (error) throw error;

    res.json({
      plan: user.subscription_plan || 'free',
      status: user.subscription_status || 'inactive',
      current_period_end: user.subscription_current_period_end || null,
    });
  } catch (err) {
    console.error('Erro GET /billing/status:', err);
    res.status(500).json({ error: 'Erro ao buscar status da assinatura' });
  }
});

// POST /api/billing/checkout — cria sessão de pagamento Stripe
router.post('/checkout', async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('email, stripe_customer_id')
      .eq('id', req.userId)
      .single();

    if (error) throw error;

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

    const sessionParams = {
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${frontendUrl}/planos?sucesso=true`,
      cancel_url: `${frontendUrl}/planos`,
      metadata: { user_id: req.userId },
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

// POST /api/billing/portal — abre o portal de gerenciamento de assinatura
router.post('/portal', async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', req.userId)
      .single();

    if (error || !user?.stripe_customer_id) {
      return res.status(400).json({ error: 'Nenhuma assinatura ativa encontrada' });
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

// Handler do webhook Stripe (registrado diretamente no server.js com raw body)
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

      if (userId && session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription);
        await supabase.from('users').update({
          stripe_customer_id: session.customer,
          subscription_id: session.subscription,
          subscription_plan: 'pro',
          subscription_status: sub.status,
          subscription_current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        }).eq('id', userId);
        console.log(`✅ Assinatura ativada para user ${userId}`);
      }
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const sub = event.data.object;
      const { data: users } = await supabase
        .from('users')
        .select('id')
        .eq('stripe_customer_id', sub.customer);

      if (users?.length) {
        const isActive = sub.status === 'active' || sub.status === 'trialing';
        await supabase.from('users').update({
          subscription_status: sub.status,
          subscription_plan: isActive ? 'pro' : 'free',
          subscription_current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        }).eq('id', users[0].id);
        console.log(`🔄 Assinatura atualizada: ${sub.status} para customer ${sub.customer}`);
      }
    }
  } catch (err) {
    console.error('Erro ao processar webhook:', err);
  }

  res.json({ received: true });
}

module.exports = { billingRouter: router, stripeWebhookHandler };
