-- ============================================
-- 💳 BILLING / ASSINATURA (Abacate Pay)
-- ============================================
-- Executar no SQL Editor do Supabase.

-- Campos de assinatura na tabela users
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS plan VARCHAR(20) DEFAULT 'trial',
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS abacate_customer_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS pending_billing_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS pending_plan VARCHAR(20);

-- Valores possíveis de `plan`:
--   'trial'       → em período de teste (ver trial_ends_at)
--   'monthly'     → assinatura mensal ativa (ver subscription_ends_at)
--   'annual'      → assinatura anual ativa (ver subscription_ends_at)
--   'whitelisted' → parceiro/afiliado com acesso gratuito e permanente
--   'inactive'    → sem acesso (trial expirado / assinatura vencida)

-- Whitelist de parceiros/afiliados (acesso gratuito)
CREATE TABLE IF NOT EXISTS whitelisted_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índice para lookup rápido por billing pendente (webhook)
CREATE INDEX IF NOT EXISTS idx_users_pending_billing ON users(pending_billing_id);

-- Exemplo para liberar um parceiro:
-- INSERT INTO whitelisted_emails (email, note) VALUES ('parceiro@email.com', 'Afiliado X');
