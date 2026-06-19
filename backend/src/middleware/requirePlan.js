const { getUserAccessStatus } = require('../services/transactionService');

// Bloqueia rotas protegidas quando o usuário não tem acesso ativo
// (trial expirado / assinatura vencida / sem plano). Whitelist e trial
// válido passam direto. Deve rodar SEMPRE depois do authMiddleware.
async function requireActivePlan(req, res, next) {
  try {
    const status = await getUserAccessStatus(req.userId);
    if (status.active) return next();
    return res.status(403).json({
      error: 'subscription_required',
      plan: status.plan,
      trial_ends_at: status.trial_ends_at,
      subscription_ends_at: status.subscription_ends_at,
    });
  } catch (err) {
    console.error('Erro no requireActivePlan:', err);
    return res.status(500).json({ error: 'Erro ao verificar assinatura' });
  }
}

module.exports = { requireActivePlan };
