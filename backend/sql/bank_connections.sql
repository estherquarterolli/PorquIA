-- Tabela de conexões bancárias (bankService)
-- Rode no Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS bank_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,          -- demo, nubank, itau, bradesco
  label VARCHAR(100),
  account_balance DECIMAL(12,2),
  credit_limit DECIMAL(12,2),
  credit_used DECIMAL(12,2),
  encrypted_credentials TEXT,             -- AES-256-GCM (NULL para o provider demo)
  last_synced_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, provider)              -- 1 conexão por banco por usuário (upsert)
);

CREATE INDEX IF NOT EXISTS idx_bank_connections_user ON bank_connections(user_id);
