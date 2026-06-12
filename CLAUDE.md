# 🚀 PorquIA - Desenvolvimento

## Projeto
**PorquIA** é um rastreador financeiro pessoal (micro-SaaS) com Telegram Bot + Web Dashboard.

**Stack:** Next.js + Node.js + PostgreSQL (Supabase) + Firebase Auth + OpenAI

---

## 📋 Sprints & Status

- [x] **Sprint 1:** Setup & Infraestrutura (CONCLUÍDO)
- [x] **Sprint 2:** Bot Telegram + Parser IA (CONCLUÍDO)
- [x] **Sprint 3:** Rotas REST & API (CONCLUÍDO)
- [ ] **Sprint 4:** Frontend Base & Dark Mode
- [ ] **Sprint 5:** Autenticação Firebase
- [ ] **Sprint 6:** Gráficos & Dashboard
- [ ] **Sprint 7:** Orçamentos & Alertas
- [ ] **Sprint 8:** Investimento Pessoal
- [ ] **Sprint 9:** Assinaturas & Detecção
- [ ] **Sprint 10:** Integração Final
- [ ] **Sprint 11:** Features Expandidas
- [ ] **Sprint 12:** Monitoring

---

## 🎯 Próximos Passos (HOJE)

### 1. Preencher Variáveis de Ambiente

#### Backend (`.env`)
```bash
TELEGRAM_BOT_TOKEN=seu_token_do_botfather
OPENAI_API_KEY=sua_api_key_openai
SUPABASE_URL=sua_url_supabase
SUPABASE_KEY=sua_chave_publica_supabase
```

#### Frontend (`.env.local`)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

### 2. Criar Contas Externas

- [ ] **Telegram Bot:** BotFather → `/newbot`
- [ ] **OpenAI API:** https://platform.openai.com/account/api-keys
- [ ] **Supabase:** https://app.supabase.com (criar projeto, região São Paulo)
- [ ] **Firebase:** https://console.firebase.google.com (criar projeto, ativar Google OAuth)

### 3. Criar Tabelas Supabase

Executar no Supabase SQL Editor:

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

### 4. Testar Ambiente Local

```bash
# Terminal 1: Backend
cd backend && npm run dev
# Esperado: "🚀 Server rodando em http://localhost:3000"

# Terminal 2: Frontend
cd frontend && npm run dev
# Esperado: "▲ Next.js... ready - started server..."

# Terminal 3: Testar integração
curl http://localhost:3000/health
# Esperado: {"status":"OK","timestamp":"..."}
```

---

## 🔌 API REST (Sprint 3)

Todas as rotas requerem autenticação via header `x-chat-id` (seu ID do Telegram chat):

### Transações
- `GET /api/transactions` — listar transações
- `POST /api/transactions` — criar transação via AI parser
  ```json
  { "message": "gastei 50 no mercado" }
  ```
- `DELETE /api/transactions/:id` — deletar transação

### Summary
- `GET /api/transactions/summary` — resumo do mês (saldo, despesas, receitas por categoria)

### Orçamentos
- `GET /api/budgets` — listar orçamentos
- `POST /api/budgets` — criar orçamento
  ```json
  { "category": "alimentação", "monthly_limit": 500 }
  ```
- `PUT /api/budgets/:id` — atualizar limite
- `DELETE /api/budgets/:id` — deletar orçamento

**Exemplo com curl:**
```bash
curl -X GET http://localhost:3000/api/transactions \
  -H "x-chat-id: 123456789"
```

---

## 🏗️ Estrutura do Projeto

```
PorquIA/
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── config/
│   │   │   └── supabase.js
│   │   ├── bot/
│   │   │   └── index.js
│   │   ├── services/
│   │   │   ├── aiParser.js
│   │   │   └── transactionService.js
│   │   ├── routes/
│   │   │   ├── transactions.js
│   │   │   └── budgets.js
│   │   └── middleware/
│   │       └── auth.js
│   ├── .env (preencher)
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── utils/
│   ├── .env.local (preencher)
│   └── package.json
└── docs/
    ├── SUMARIO_EXECUTIVO.md
    ├── PLANO_SPRINTS_FINANCEIRO.md
    ├── QUICK_START_SPRINT_1.md
    └── MATRIZ_DEPENDENCIAS_PRIORIZACAO.md
```

---

## 💡 Convenções de Desenvolvimento

### Git Commits
- Usar formato: `type: descrição` (ex: `feat: add bot parser`)
- Fazer commit ao fim de cada tarefa, mesmo pequena
- Manter histórico limpo e rastreável

### Branches
- `main`: Código de produção
- `feature/...`: Novas features
- `fix/...`: Bug fixes

### Código
- Usar ESLint + Prettier (automaticamente)
- TypeScript no frontend, JavaScript no backend
- Nomes claros e descritivos
- Comentários apenas para lógica complexa

---

## 📞 Referências Rápidas

- **Documentação:** Ver `PLANO_SPRINTS_FINANCEIRO.md`
- **Dependências:** Ver `MATRIZ_DEPENDENCIAS_PRIORIZACAO.md`
- **Quick Start:** Ver `QUICK_START_SPRINT_1.md`

---

## ⚠️ Pontos Críticos

1. **Sprint 3 (Database)** → Não pode atrasar (bloqueia Sprint 5)
2. **Sprint 5 (Auth)** → Crítico (bloqueia tudo depois)
3. **Sprint 10 (Integração)** → Essencial para launch

---

## 🚀 Como Executar

### Desenvolvimento
```bash
# Backend
cd backend && npm run dev

# Frontend (outro terminal)
cd frontend && npm run dev
```

### Build
```bash
# Frontend
cd frontend && npm run build && npm run start
```

---

*Último update: 2026-06-12*
*Sprint Atual: 3 (Banco de Dados & Persistência)*
