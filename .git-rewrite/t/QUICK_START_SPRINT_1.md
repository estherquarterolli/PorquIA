# 🚀 Quick Start - Sprint 1 (Hoje!)

## Objetivo da Semana
Ter ambiente completo pronto, repos estruturados, contas criadas, **primeira linha de código commitada**.

---

## ✅ Checklist Pré-requisitos

- [ ] Node.js 18+ instalado (`node -v`)
- [ ] Git configurado com SSH (`ssh -T git@github.com`)
- [ ] Conta GitHub/GitLab
- [ ] Conta Google para OAuth
- [ ] 6-8 horas de tempo focado

---

## 📝 Passo a Passo Executável

### BLOCO 1: Setup Git & Backend (45min)

```bash
# 1. Criar pasta do projeto
mkdir meu-rastreador-financeiro
cd meu-rastreador-financeiro

# 2. Inicializar git
git init
git branch -m main
# Criar repo no GitHub, copiar HTTPS URL
git remote add origin <URL-DO-REPO>

# 3. Criar arquivo .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
.DS_Store
*.log
dist/
build/
.next/
out/
EOF

git add .gitignore
git commit -m "chore: initial gitignore"
git push -u origin main

# 4. Criar pasta backend
mkdir backend
cd backend

# 5. Inicializar Node.js
npm init -y

# 6. Instalar dependências
npm install express cors dotenv axios
npm install --save-dev nodemon

# 7. Criar .env
cat > .env << 'EOF'
NODE_ENV=development
PORT=3000
TELEGRAM_BOT_TOKEN=seu_token_aqui
OPENAI_API_KEY=sua_chave_aqui
SUPABASE_URL=sua_url_aqui
SUPABASE_KEY=sua_chave_aqui
FIREBASE_PROJECT_ID=seu_projeto_aqui
EOF

# 8. Atualizar package.json scripts
# Abrir package.json e substituir "test" por:
# "scripts": {
#   "start": "node src/server.js",
#   "dev": "nodemon src/server.js"
# }

# 9. Criar estrutura de pastas
mkdir -p src/{routes,models,utils}
touch src/server.js

# 10. Criar server.js inicial
cat > src/server.js << 'EOF'
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);
});
EOF

# 11. Testar
npm run dev
# Esperado: "🚀 Server rodando em http://localhost:3000"
# Abrir em outro terminal: curl http://localhost:3000/health

# 12. Commit
git add -A
git commit -m "feat: setup backend inicial com Express"
git push
```

✅ **Milestone:** Backend rodando com health check

---

### BLOCO 2: Setup Frontend (45min)

```bash
# Voltar à raiz do projeto
cd ..

# 1. Criar app Next.js
# (escolha: No TypeScript, No Tailwind, Yes ESLint, Yes src/, Yes App Router)
npx create-next-app@latest frontend --typescript

cd frontend

# 2. Instalar Tailwind (pode ter falhado na criação)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Configurar Tailwind para dark mode
# Abrir tailwind.config.ts e substituir o objeto theme:
# theme: {
#   extend: {
#     colors: {
#       purple: {
#         900: '#26215C',
#         800: '#3C3489',
#         600: '#534AB7',
#         500: '#7F77DD',
#         400: '#AFA9EC',
#       },
#     },
#   },
# },
# darkMode: 'class',

# 4. Instalar shadcn/ui
npx shadcn-ui@latest init
# Escolher: TypeScript, Yes (usar CSS variables), Slate theme

# 5. Instalar Recharts
npm install recharts

# 6. Instalar Firebase
npm install firebase

# 7. Criar estrutura de pastas
mkdir -p src/{app,components,lib,utils}

# 8. Criar arquivo .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
NEXT_PUBLIC_API_URL=http://localhost:3000
EOF

# 9. Testar
npm run dev
# Esperado: acesso em http://localhost:3001

# 10. Commit
cd ..
git add -A
git commit -m "feat: setup frontend Next.js com Tailwind e shadcn"
git push
```

✅ **Milestone:** Frontend rodando em localhost:3001

---

### BLOCO 3: Contas Externas (30min)

**TELEGRAM BOT**

1. Abrir Telegram e buscar `@BotFather`
2. Comando: `/newbot`
3. Escolher nome (ex: `MeuRastreadorBot`)
4. Escolher username (ex: `meu_rastreador_bot`)
5. Copiar token (formato: `123456789:ABCdefGHIJKlmnoPQRstuvWXYZabcDEFg`)
6. Adicionar em `.env` do backend

**OPENAI API**

1. Ir para https://platform.openai.com/account/api-keys
2. Criar nova API key
3. Copiar e adicionar em `.env` do backend
4. Configurar quota/spending limit

**SUPABASE**

1. Ir para https://app.supabase.com
2. Criar novo projeto
3. Selecionar region (São Paulo = `sa-east-1`)
4. Copiar URL (`https://xxx.supabase.co`) e chave pública
5. Adicionar em `.env` do backend

**FIREBASE**

1. Ir para https://console.firebase.google.com
2. Criar novo projeto
3. Ativar Google Sign-In (Authentication > Sign-in method)
4. Copiar credenciais (project ID, etc)
5. Adicionar em `.env.local` do frontend

✅ **Milestone:** Todas as contas criadas e credenciais em `.env`

---

### BLOCO 4: Primeira Query Supabase (30min)

No Supabase console:

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
  user_id UUID NOT NULL REFERENCES users(id),
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
  user_id UUID NOT NULL REFERENCES users(id),
  category VARCHAR(50) NOT NULL,
  monthly_limit DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_budgets_user ON budgets(user_id);
```

✅ **Milestone:** Tabelas criadas no Supabase

---

### BLOCO 5: Testar Conexão Backend ↔ Supabase (20min)

No backend, criar arquivo `src/utils/db.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
```

Adicionar rota de teste em `src/server.js`:

```javascript
const supabase = require('./utils/db');

app.post('/api/test-transaction', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: '00000000-0000-0000-0000-000000000000', // UUID dummy
          amount: 150.00,
          description: 'Teste',
          category: 'Alimentação',
          payment_method: 'CREDIT'
        }
      ]);
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

Testar:
```bash
curl -X POST http://localhost:3000/api/test-transaction
# Esperado: {"success":true,"data":[...]}
```

✅ **Milestone:** Backend conectado ao Supabase

---

### BLOCO 6: README & Documentação (15min)

Criar `README.md` na raiz:

```markdown
# 💰 Rastreador Financeiro - Micro-SaaS

## Stack
- **Frontend:** Next.js 14, React, TailwindCSS, shadcn/ui
- **Backend:** Node.js, Express, Telegraf
- **Database:** PostgreSQL (Supabase)
- **Auth:** Firebase (Google OAuth)
- **AI:** OpenAI GPT-4o-mini

## Setup Local

### Backend
\`\`\`bash
cd backend
npm install
cp .env.example .env # Preencher com credenciais
npm run dev
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm install
cp .env.local.example .env.local # Preencher com credenciais
npm run dev
\`\`\`

Acessar:
- Frontend: http://localhost:3001
- Backend: http://localhost:3000

## Variáveis de Ambiente

Ver `.env.example` no backend e `.env.local.example` no frontend.

## Status do Projeto

- [x] Sprint 1: Setup & Infraestrutura (EM PROGRESSO)
- [ ] Sprint 2: Bot Telegram + Parser IA
- [ ] Sprint 3: Banco de Dados
- [ ] ... (ver PLANO_SPRINTS_FINANCEIRO.md)

## Próximos Passos

1. Finalizar Sprint 1 (hoje!)
2. Começar Sprint 2 (próxima semana)
```

✅ **Milestone:** Documentação criada

---

## 🎯 Fim do Dia 1 - Validação Final

Executar em ordem:

```bash
# Terminal 1: Backend
cd backend && npm run dev
# Esperado: "🚀 Server rodando em http://localhost:3000"

# Terminal 2: Frontend
cd frontend && npm run dev
# Esperado: "▲ Next.js 14.0... ready - started server on 0.0.0.0:3001"

# Terminal 3: Testar integração
curl http://localhost:3000/health
# Esperado: {"status":"OK","timestamp":"..."}

# Verificar Supabase
# - Entrar em https://app.supabase.com
# - Tabelas criadas? ✅
# - Índices criados? ✅
```

---

## 📋 Commit Summary do Dia

```bash
git log --oneline
# Esperado:
# 3a2b1c0 (HEAD -> main) docs: add README e documentação sprint
# f4e5d6c feat: integrate Supabase database
# c7b8a9d feat: setup frontend Next.js com Tailwind
# 9e8d7c6 feat: setup backend inicial com Express
# 4a3b2c1 chore: initial gitignore
```

---

## 💡 Dicas para Amanhã

1. **Backup das credenciais:** Salvar `.env` e `.env.local` em password manager (1Password, LastPass)
2. **Documentar erros:** Se encontrar erro, anotar e compartilhar
3. **Testar no celular:** Abrir Next.js em outro dispositivo na rede local
4. **Fazer 1º commit ao vivo:** Push para repo após cada bloco = segurança

---

## 🆘 Troubleshooting

### Port 3000/3001 já em uso
```bash
# Encontrar processo
lsof -i :3000
# Matar processo
kill -9 <PID>
```

### Erro de CORS
Verificar se `cors()` está em `src/server.js` ANTES de outras rotas.

### Supabase connection error
- Copiar URL e KEY exatamente (sem espacos)
- Verificar region selecionada
- Testar com `curl` direto na Supabase

### Next.js não compila
```bash
# Limpar cache
rm -rf .next
npm run dev
```

---

**Tempo Total Estimado:** 4-5 horas  
**Próximo milestone:** Sprint 2 (Bot Telegram)

Boa sorte! 🚀
