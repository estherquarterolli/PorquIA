# 💰 PorquIA - Rastreador Financeiro Pessoal

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-blue)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**PorquIA** é um micro-SaaS de gestão financeira pessoal que combina:
- 🤖 **Bot Telegram** para captura de despesas em linguagem natural
- 📊 **Dashboard Web** para visualização e análise
- 🧠 **IA (OpenAI)** para extrair dados estruturados das mensagens
- 💾 **PostgreSQL** para persistência de dados

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+ (`node -v`)
- npm ou yarn
- Git

### Setup Local

1. **Clone o repositório**
```bash
git clone https://github.com/estherquarterolli/PorquIA.git
cd PorquIA
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env  # Preencher credenciais
npm run dev           # Rodará em http://localhost:3000
```

3. **Setup Frontend** (novo terminal)
```bash
cd frontend
npm install
cp .env.local.example .env.local  # Preencher credenciais
npm run dev                        # Rodará em http://localhost:3001
```

4. **Validar**
```bash
# Em outro terminal
curl http://localhost:3000/health
# Esperado: {"status":"OK","timestamp":"..."}
```

---

## 📚 Stack & Tecnologias

| Camada | Tecnologia | Propósito |
|--------|-----------|----------|
| **Frontend** | Next.js 14, React, TypeScript | Web Dashboard |
| **Backend** | Node.js, Express | API & Bot |
| **Database** | PostgreSQL (Supabase) | Dados persistentes |
| **Auth** | Firebase (Google OAuth) | Autenticação |
| **AI** | OpenAI API (GPT-4o-mini) | Parsing de mensagens |
| **Bot** | Telegraf | Telegram integration |
| **Charts** | Recharts | Visualização de dados |
| **UI** | TailwindCSS, shadcn/ui | Design system |

---

## 📋 Variáveis de Ambiente

### Backend (`.env`)
```env
NODE_ENV=development
PORT=3000
TELEGRAM_BOT_TOKEN=seu_token_botfather
OPENAI_API_KEY=sua_chave_openai
SUPABASE_URL=sua_url_supabase
SUPABASE_KEY=sua_chave_supabase
FIREBASE_PROJECT_ID=seu_project_id
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=seu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 🎯 Roadmap (12 Sprints)

### ✅ Fase 1: Infraestrutura (Sprint 1)
- [x] Setup Git & Node.js
- [x] Criar Backend (Express) + Frontend (Next.js)
- [x] Configurar Tailwind + Dark Mode
- [ ] Contas externas criadas (Telegram, OpenAI, Supabase, Firebase)
- [ ] Tabelas Supabase criadas

### 📋 Fase 2: Backend Core (Sprints 2-3)
- [ ] Bot Telegram recebendo mensagens
- [ ] Parser IA estruturando dados
- [ ] Banco de dados persistindo transações

### 🎨 Fase 3: Frontend & Auth (Sprints 4-5)
- [ ] Interface moderna (Dark UI roxo)
- [ ] Autenticação com Google
- [ ] Dashboard privado

### 📈 Fase 4: Visualização (Sprint 6)
- [ ] Gráficos com Recharts (Pizza, Linhas, Barras)
- [ ] KPI cards
- [ ] Filtros e dashboards

### 🎯 Fase 5: Features Principais (Sprints 7-10)
- [ ] Orçamentos com alertas
- [ ] Dashboard de investimento pessoal
- [ ] Detecção de assinaturas recorrentes
- [ ] Testes E2E

### 🚀 Fase 6: Expansão (Sprints 11-12)
- [ ] Exportação de dados
- [ ] Monitoring & Analytics
- [ ] Suporte ao usuário

---

## 📁 Estrutura de Pasta

```
PorquIA/
├── backend/                      # Node.js + Express
│   ├── src/
│   │   ├── server.js
│   │   ├── config/
│   │   │   └── supabase.js
│   │   ├── routes/               # Endpoints da API
│   │   ├── models/               # Database queries
│   │   └── utils/                # Helpers
│   ├── .env                      # Variáveis (não commitar)
│   ├── .env.example              # Template
│   └── package.json
│
├── frontend/                     # Next.js + React
│   ├── src/
│   │   ├── app/                  # Páginas
│   │   ├── components/           # React components
│   │   ├── lib/                  # Configurações (Firebase, Auth)
│   │   └── utils/                # Helpers
│   ├── public/                   # Assets estáticos
│   ├── .env.local                # Variáveis (não commitar)
│   ├── .env.local.example        # Template
│   └── package.json
│
├── docs/
│   ├── SUMARIO_EXECUTIVO.md      # Visão geral do projeto
│   ├── PLANO_SPRINTS_FINANCEIRO.md
│   ├── QUICK_START_SPRINT_1.md
│   └── MATRIZ_DEPENDENCIAS_PRIORIZACAO.md
│
├── CLAUDE.md                     # Instruções para desenvolvimento
├── README.md                     # Este arquivo
└── .gitignore
```

---

## 🔑 Configuração Necessária

### 1. Telegram Bot
1. Abra Telegram e procure por `@BotFather`
2. Comando: `/newbot`
3. Escolha nome e username
4. Copie o token para `.env` (TELEGRAM_BOT_TOKEN)

### 2. OpenAI API
1. Acesse https://platform.openai.com/account/api-keys
2. Crie nova API key
3. Copie para `.env` (OPENAI_API_KEY)

### 3. Supabase
1. Acesse https://app.supabase.com
2. Crie novo projeto (região: São Paulo)
3. Copie URL e chave pública para `.env`
4. Execute o SQL para criar tabelas (ver CLAUDE.md)

### 4. Firebase
1. Acesse https://console.firebase.google.com
2. Crie novo projeto
3. Ative Google Sign-In (Authentication > Sign-in method)
4. Copie credenciais para `.env.local`

---

## 🧪 Testes

### Health Check
```bash
curl http://localhost:3000/health
```

### Testar Bot (após configuração)
Enviar mensagem no Telegram e validar resposta.

### Frontend
```bash
cd frontend
npm run build    # Verificar build
npm run dev      # Servidor de desenvolvimento
```

---

## 📊 Status de Desenvolvimento

**Sprint Atual:** 1 (Setup & Infraestrutura) 🚀

| Sprint | Nome | Status | % Completo |
|--------|------|--------|-----------|
| 1 | Setup & Infraestrutura | 🟡 Em Progresso | 60% |
| 2 | Bot + IA | ⬜ Pendente | 0% |
| 3 | Banco de Dados | ⬜ Pendente | 0% |
| 4 | Frontend Base | ⬜ Pendente | 0% |
| 5 | Autenticação | ⬜ Pendente | 0% |
| 6+ | Features | ⬜ Pendente | 0% |

---

## 🤝 Contribuindo

Este é um projeto pessoal, mas aceita sugestões via:
- Issues (bugs, features)
- Discussions (ideias)
- Pull Requests

---

## 📜 Licença

MIT License - veja LICENSE para detalhes

---

## 📞 Contato

**Desenvolvedor:** Esther Quarterolli  
**Email:** estherquarterollii@gmail.com  
**GitHub:** [@estherquarterolli](https://github.com/estherquarterolli)

---

## 🎓 Recursos

- **Documentação Completa:** Ver `SUMARIO_EXECUTIVO.md`
- **Plano de Sprints:** Ver `PLANO_SPRINTS_FINANCEIRO.md`
- **Matriz de Dependências:** Ver `MATRIZ_DEPENDENCIAS_PRIORIZACAO.md`
- **Quick Start:** Ver `QUICK_START_SPRINT_1.md`

---

**Última atualização:** 2026-06-12  
**Status:** 🟢 Desenvolvimento Ativo