# 🚀 Quick Start - PorquIA

## 📋 Pré-requisitos

- ✅ Node.js 18+ instalado
- ✅ Conta Telegram (para obter seu chat_id)
- ✅ Supabase projeto criado
- ✅ OpenAI API key
- ✅ Variáveis de ambiente configuradas

---

## 🔧 Configuração

### 1. Backend (`.env`)

```bash
cp backend/.env.example backend/.env
```

Preencha com seus valores:

```env
TELEGRAM_BOT_TOKEN=seu_token_do_botfather
OPENAI_API_KEY=sua_chave_openai
SUPABASE_URL=sua_url_supabase
SUPABASE_KEY=sua_chave_publica_supabase
PORT=3000
```

### 2. Frontend (`.env.local`)

```bash
cp frontend/.env.local.example frontend/.env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=sua_chave_firebase
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_dominio_firebase
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

### 3. Banco de Dados (Supabase)

Execute este SQL no **SQL Editor** do Supabase:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id VARCHAR(255) UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  telegram_chat_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  payment_method VARCHAR(20),
  installments INTEGER DEFAULT 1,
  type VARCHAR(10) DEFAULT 'despesa',
  date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  category VARCHAR(50) NOT NULL,
  monthly_limit DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_budgets_user ON budgets(user_id);
```

---

## 🎯 Como Obter o chat_id do Telegram

1. Envie uma mensagem para seu bot no Telegram
2. Acesse: `https://api.telegram.org/bot<SEU_TOKEN>/getUpdates`
3. Procure por `"chat": {"id": XXXXX}`
4. Copie esse número (seu chat_id)

---

## 📱 Rodar Localmente

### Terminal 1 - Backend

```bash
cd backend
npm install
npm run dev
```

Esperado: `🚀 Server rodando em http://localhost:3000`

### Terminal 2 - Frontend

```bash
cd frontend
npm install
npm run dev
```

Esperado: `▲ Next.js... ready - started server...`

### Terminal 3 - Abra o navegador

```
http://localhost:3000
```

Quando carregar, insira seu `chat_id` do Telegram.

---

## 🧪 Testar o Bot no Telegram

1. Abra o Telegram e procure pelo bot que você criou
2. Envie mensagens:
   - `"gastei 50 no mercado"`
   - `"paguei 1200 de aluguel no pix"`
   - `"recebi salário 5000"`
3. Use comandos:
   - `/resumo` — resumo do mês
   - `/ultimas` — últimas 5 transações

---

## 📊 Testar o Dashboard Web

1. No navegador, vá para `http://localhost:3000/dashboard`
2. Clique em **Transações** e adicione uma transação
3. Clique em **Orçamentos** e configure um limite
4. Veja o gráfico atualizar no Dashboard

---

## 🐛 Troubleshooting

### Error: TELEGRAM_BOT_TOKEN não configurado
- Verifique se `.env` foi preenchido corretamente
- Reinicie o backend com `npm run dev`

### Error: SUPABASE_URL or SUPABASE_KEY not set
- Copie os valores corretos de Supabase → Settings → API
- Verifique se as chaves estão no `.env` (não `.env.local`)

### Error: chat_id obrigatório
- Insira seu chat_id do Telegram quando o app pedir
- Ou adicione `localStorage.setItem('chat_id', 'seu_id')` no console

### Port 3000 já em uso
- Mude em `backend/.env`: `PORT=3001`
- Ou finalize o processo que está usando a porta

---

## 🚀 Próximos Passos

- **Sprint 5:** Implementar Firebase Auth
- **Sprint 6:** Gráficos avançados
- **Sprint 7:** Alertas de orçamento

---

*Desenvolvido com ❤️ para você, seu porquinho financeiro!*
