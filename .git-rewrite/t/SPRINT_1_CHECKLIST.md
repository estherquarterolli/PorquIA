# ✅ Sprint 1 - Setup & Infraestrutura

## 🎯 Objetivo
Configurar ambiente, ferramentas e templates iniciais para o projeto PorquIA.

**Status:** 🟡 **60% COMPLETO** (Em Progresso)

---

## ✅ Tarefas Completadas

### Bloco 1: Setup Git & Backend (45min) ✅
- [x] Criar `.gitignore` com padrão Node.js/Next.js
- [x] Inicializar git e fazer primeiro commit
- [x] Criar pasta `/backend`
- [x] `npm init` e instalar dependências (Express, CORS, Dotenv, Axios, Supabase)
- [x] Criar `.env` e `.env.example`
- [x] Atualizar `package.json` com scripts (`start`, `dev`)
- [x] Criar estrutura de pastas (`/src`, `/routes`, `/models`, `/utils`, `/config`)
- [x] Criar `src/server.js` com health check
- [x] Criar `src/config/supabase.js`
- [x] Fazer commit: "feat: setup backend inicial com Express"

### Bloco 2: Setup Frontend (45min) ✅
- [x] `npx create-next-app` com TypeScript + Tailwind + ESLint
- [x] Instalar Recharts
- [x] Instalar Firebase
- [x] Criar `.env.local` e `.env.local.example`
- [x] Configurar Tailwind com dark mode e cores roxas (#7F77DD)
- [x] Atualizar `globals.css` com temas
- [x] Criar `tailwind.config.ts`
- [x] Fazer commit: "feat: setup frontend Next.js com Tailwind"

### Bloco 3: Documentação & Configuração ✅
- [x] Copiar todos os documentos de sprint (.md)
- [x] Criar `CLAUDE.md` com instruções de desenvolvimento
- [x] Criar `README.md` completo
- [x] Fazer commit final com documentação

### Bloco 4: Validação Inicial ✅
- [x] Backend compila (`npm run dev` funciona)
- [x] Frontend compila (`npm run dev` funciona)
- [x] Commits históricos visíveis

---

## ⬜ Tarefas Pendentes (Completar HOJE)

### Bloco 3: Contas Externas (30min) ⏳
Precisa ser feito MANUALMENTE no navegador:

- [ ] **Telegram Bot**
  - Abrir Telegram → Buscar `@BotFather`
  - Comando: `/newbot`
  - Escolher nome: "PorquIA" (ou similar)
  - Escolher username: "porquia_bot" (ou similar)
  - Copiar token → Colar em `backend/.env` (TELEGRAM_BOT_TOKEN)

- [ ] **OpenAI API**
  - Ir para: https://platform.openai.com/account/api-keys
  - Criar nova API key
  - Copiar → Colar em `backend/.env` (OPENAI_API_KEY)
  - Configurar spending limit (~$10-20)

- [ ] **Supabase**
  - Ir para: https://app.supabase.com
  - Criar novo projeto
  - Escolher region: **São Paulo (sa-east-1)**
  - Copiar URL → `backend/.env` (SUPABASE_URL)
  - Copiar chave pública → `backend/.env` (SUPABASE_KEY)

- [ ] **Firebase**
  - Ir para: https://console.firebase.google.com
  - Criar novo projeto (ex: "PorquIA Dev")
  - Aguardar criação (~30s)
  - Ir para: Authentication > Sign-in method
  - Ativar "Google"
  - Copiar credenciais → `frontend/.env.local`
    - API Key → NEXT_PUBLIC_FIREBASE_API_KEY
    - Auth Domain → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    - Project ID → NEXT_PUBLIC_FIREBASE_PROJECT_ID
    - Storage Bucket → NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    - Sender ID → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
    - App ID → NEXT_PUBLIC_FIREBASE_APP_ID

### Bloco 4: Criar Tabelas Supabase (30min) ⏳
Executar SQL no Supabase Console (Menu > SQL Editor > New Query):

```sql
-- Criar tabela users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id VARCHAR(255) UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  telegram_chat_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  payment_method VARCHAR(20),
  installments INTEGER DEFAULT 1,
  date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela budgets
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  monthly_limit DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_budgets_user ON budgets(user_id);
```

### Bloco 5: Testar Ambiente Local (20min) ⏳

```bash
# Terminal 1: Backend
cd backend && npm run dev
# Esperado: "🚀 Server rodando em http://localhost:3000"

# Terminal 2: Frontend
cd frontend && npm run dev
# Esperado: "▲ Next.js 14... ready - started server on 0.0.0.0:3001"

# Terminal 3: Testar integração
curl http://localhost:3000/health
# Esperado: {"status":"OK","timestamp":"2026-06-12T..."}
```

---

## 📊 Sumário do Progresso

| Tarefa | Status | Tempo | Observações |
|--------|--------|-------|------------|
| Git & Backend | ✅ | 45min | Completo |
| Frontend | ✅ | 45min | Completo |
| Documentação | ✅ | 20min | Completo |
| **Contas Externas** | ⏳ | 30min | **PRÓXIMO** |
| **Tabelas DB** | ⏳ | 30min | **PRÓXIMO** |
| **Testes Locais** | ⏳ | 20min | **PRÓXIMO** |
| **TOTAL SPRINT 1** | 🟡 60% | ~4h | Faltam 1.5h |

---

## 🎯 Critério de Conclusão da Sprint 1

### ✅ Para Marcar Sprint 1 como COMPLETO:

1. [ ] `npm start` funciona no backend (porta 3000)
2. [ ] `npm run dev` funciona no frontend (porta 3001)
3. [ ] Variáveis de ambiente carregam sem erro (backend + frontend)
4. [ ] GET `/health` retorna 200 OK
5. [ ] Git commits históricos aparecem (`git log`)
6. [ ] Todas as contas criadas (Telegram, OpenAI, Supabase, Firebase)
7. [ ] Tabelas criadas no Supabase
8. [ ] Dados conseguem INSERT/SELECT no Supabase

### ✅ Checklist de Validação
- [ ] Backend rodando localmente
- [ ] Frontend rodando localmente
- [ ] `.env` preenchido (backend)
- [ ] `.env.local` preenchido (frontend)
- [ ] Contas externas criadas
- [ ] Supabase conecta ao backend
- [ ] ZERO console errors na primeira execução

---

## 🚀 Próximas Sprints

### Sprint 2: Bot Telegram + Parser IA (Semana 2)
Começar APÓS Sprint 1 estar 100% completo.
- Instalar Telegraf
- Criar parser IA com OpenAI
- Testar fluxo: Telegram → IA → JSON

### Sprint 3: Banco de Dados & Persistência (Semana 3)
Executar em paralelo com Sprint 2.
- Criar functions Supabase
- Conectar bot ao BD
- Testar E2E: Telegram → Supabase

### Sprint 4: Frontend Base (Semana 4)
Pode começar quando Sprint 1 estiver pronto.
- Layout principal
- Dark mode
- Navbar + Sidebar

### Sprint 5: Autenticação (Semana 5) ⭐ **CRÍTICO**
BLOQUEIA Sprints 6-10. Não atrasar!

---

## 💡 Dicas Para Amanhã

1. **Backup das credenciais:** Salvar `.env` e `.env.local` em 1Password/LastPass
2. **Documentar erros:** Se encontrar erro, anotar e compartilhar
3. **Testar em mobile:** Abrir Next.js em outro dispositivo na rede local
4. **Fazer commits pequenos:** Push frequente = segurança

---

## ⏰ Timeline Esperado

| Atividade | Tempo Estimado | Tempo Real |
|-----------|-----------------|-----------|
| Bloco 1 (Git + Backend) | 45 min | ✅ 35 min |
| Bloco 2 (Frontend) | 45 min | ✅ 40 min |
| Bloco 3 (Documentação) | 20 min | ✅ 15 min |
| **Contas Externas** | 30 min | ⏳ Pendente |
| **Tabelas DB** | 30 min | ⏳ Pendente |
| **Testes Locais** | 20 min | ⏳ Pendente |
| **TOTAL** | ~3.5h | 🟡 ~2h (60%) |

---

## 📞 Referências Rápidas

- **Docs Completos:** Ver `SUMARIO_EXECUTIVO.md`
- **Plano Detalhado:** Ver `PLANO_SPRINTS_FINANCEIRO.md`
- **Quick Start:** Ver `QUICK_START_SPRINT_1.md`
- **Dependências:** Ver `MATRIZ_DEPENDENCIAS_PRIORIZACAO.md`
- **Desenvolvimento:** Ver `CLAUDE.md`

---

## 🎓 O Que Vem Depois

Após completar Sprint 1 com sucesso:

1. **Sprint 2 (Bot):** Semana que vem
2. **Sprint 3 (Database):** Paralelo com Sprint 2
3. **Sprints 4-5:** Autenticação e Frontend
4. **Sprints 6-10:** Features principais
5. **Sprints 11-12:** Polishing e Launch

**Chance de sucesso:** 95% (com disciplina) 🚀

---

**Sprint 1 Iniciado:** 2026-06-12  
**Sprint 1 Esperado:** 2026-06-16 (in 4 days)  
**Status Atual:** 🟡 Em Progresso - Faltam 1.5h
