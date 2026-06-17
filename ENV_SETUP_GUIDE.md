# 📋 Guia Completo de Variáveis de Ambiente

Este guia explica **passo a passo** como obter e configurar cada variável de ambiente do PorquIA.

---

## 🚀 Quick Start (5 minutos)

### Backend
```bash
cd backend
cp .env.example .env
# Editar .env e preencher as variáveis abaixo
```

### Frontend
```bash
cd frontend
cp .env.local.example .env.local
# Editar .env.local e preencher as variáveis abaixo
```

---

## 🔐 BACKEND - Variáveis Obrigatórias

### 1. TELEGRAM_BOT_TOKEN
**O que é:** Token único do seu bot Telegram  
**Onde obter:**
1. Abrir Telegram (app ou web.telegram.org)
2. Procurar por `@BotFather` (bot oficial do Telegram)
3. Enviar comando: `/newbot`
4. Seguir as instruções:
   - Nome: `PorquIA` (ou qualquer nome)
   - Username: `porquia_bot` (único, com `_bot` no final)
5. Copiar token (formato: `123456789:ABCdefGHIJKlmnoPQRstuvWXYZabcDEFg`)

**Valor esperado:**
```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIJKlmnoPQRstuvWXYZabcDEFg
```

**Segurança:** 🔴 **NUNCA** compartilhar este token

---

### 2. OPENAI_API_KEY
**O que é:** Chave de acesso à API da OpenAI  
**Onde obter:**
1. Ir para: https://platform.openai.com/account/api-keys
2. Login com conta Google/Email
3. Clicar em "Create new secret key"
4. Copiar a chave (começa com `SUA_OPENAI_API_KEY`)
5. **Guardar em local seguro** (após sair da página, não consegue ver novamente)

**Valor esperado:**
```env
OPENAI_API_KEY=SUA_OPENAI_API_KEY
```

**Segurança:** 🔴 **NUNCA** compartilhar | Usar chaves separadas para dev/prod

**Controle de custos:**
1. Ir para https://platform.openai.com/account/billing/overview
2. Clicar em "Set usage limits"
3. Definir limite: $10/mês (para dev)
4. Monitorar em "Usage" regularmente

---

### 3. SUPABASE_URL
**O que é:** URL do banco de dados PostgreSQL  
**Onde obter:**
1. Ir para: https://app.supabase.com
2. Login com GitHub/Google
3. Clicar em "New project"
4. Preencher:
   - **Name:** `porquia-dev` (ou `porquia-prod`)
   - **Database Password:** Gerar senha forte (guardar!)
   - **Region:** `São Paulo (sa-east-1)` ← **IMPORTANTE**
5. Aguardar criação (~2 minutos)
6. Ir para: Project Settings > API
7. Copiar URL em "Project URL"

**Valor esperado:**
```env
SUPABASE_URL=https://xxxxxx.supabase.co
```

**Segurança:** 🟡 Relativamente seguro (precisa da chave junto)

---

### 4. SUPABASE_KEY
**O que é:** Chave pública do Supabase (segura)  
**Onde obter:**
1. No Supabase Console: Project Settings > API
2. Procurar por "Project API keys"
3. Copiar a chave em **"public"** (começa com `eyJhbG...`)
4. **NÃO usar a chave "secret"** aqui

**Valor esperado:**
```env
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Segurança:** 🟢 Seguro (é pública mesmo)

---

### 5. SUPABASE_SECRET_KEY (Opcional - Backend apenas)
**O que é:** Chave secreta do Supabase (admin)  
**Onde obter:**
1. Supabase Console: Project Settings > API
2. Copiar a chave em **"secret"** (começa com `eyJhbGci...`)
3. **NUNCA** expor em frontend ou repositório público

**Valor esperado:**
```env
SUPABASE_SECRET_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Segurança:** 🔴 **SUPER SECRETO** - Backend only

---

### 6. FIREBASE_PROJECT_ID
**O que é:** Identificador único do seu projeto Firebase  
**Onde obter:**
1. Ir para: https://console.firebase.google.com
2. Login com Google
3. Clicar em "Create a project"
4. Preencher:
   - **Project name:** `PorquIA` (ou similar)
   - Aceitar termos
5. Aguardar criação
6. Ir para: Project Settings (⚙️ canto superior direito)
7. Copiar "Project ID"

**Valor esperado:**
```env
FIREBASE_PROJECT_ID=porquia-dev
```

**Segurança:** 🟢 Público (não é sensível)

---

## 🎨 FRONTEND - Variáveis Obrigatórias

### 1. NEXT_PUBLIC_FIREBASE_API_KEY
**O que é:** Chave pública de API do Firebase  
**Onde obter:**
1. Firebase Console: Project Settings
2. Aba "General"
3. Procurar por "Your web app"
4. Se não existir, clicar em `</> Add app`
5. Selecionar "Web"
6. Preencher nome: `porquia-web`
7. Copiar "apiKey"

**Valor esperado:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Segurança:** 🟢 Seguro (é pública)

---

### 2. NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
**O que é:** Domínio para autenticação  
**Valor padrão:** `{PROJECT_ID}.firebaseapp.com`

**Exemplo:**
```env
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=porquia-dev.firebaseapp.com
```

**Segurança:** 🟢 Seguro

---

### 3. NEXT_PUBLIC_FIREBASE_PROJECT_ID
**O que é:** Mesmo do backend  
**Valor esperado:**
```env
NEXT_PUBLIC_FIREBASE_PROJECT_ID=porquia-dev
```

---

### 4. NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
**O que é:** Bucket para armazenar arquivos  
**Valor padrão:** `{PROJECT_ID}.appspot.com`

**Exemplo:**
```env
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=porquia-dev.appspot.com
```

---

### 5. NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
**O que é:** ID para notificações push  
**Onde obter:**
- Firebase Console: Project Settings > General
- Procurar por "Cloud Messaging API" ou "Sender ID"

**Valor esperado:**
```env
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
```

---

### 6. NEXT_PUBLIC_FIREBASE_APP_ID
**O que é:** ID único da aplicação  
**Valor esperado:**
```env
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xxxxxxxxxxxxxxxx
```

---

### 7. NEXT_PUBLIC_API_URL
**O que é:** URL da API backend  
**Valores:**
- **Desenvolvimento:** `http://localhost:3000`
- **Produção:** `https://api.porquia.com` (seu domínio)

**Valor esperado:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 📝 Checklist de Configuração

### Dia 1: Criar Contas (30 minutos)

- [ ] **Telegram Bot**
  - [ ] Abrir Telegram
  - [ ] Conversar com `@BotFather`
  - [ ] Executar `/newbot`
  - [ ] Copiar token
  - [ ] Colar em `backend/.env` (TELEGRAM_BOT_TOKEN)

- [ ] **OpenAI API**
  - [ ] Ir para https://platform.openai.com/account/api-keys
  - [ ] Criar API key
  - [ ] Copiar chave
  - [ ] Colar em `backend/.env` (OPENAI_API_KEY)
  - [ ] Configurar spending limit ($10)

- [ ] **Supabase**
  - [ ] Ir para https://app.supabase.com
  - [ ] Criar novo projeto (região: São Paulo)
  - [ ] Copiar URL
  - [ ] Copiar chave pública
  - [ ] Colar em `backend/.env`

- [ ] **Firebase**
  - [ ] Ir para https://console.firebase.google.com
  - [ ] Criar novo projeto
  - [ ] Ir para Project Settings
  - [ ] Copiar credenciais web
  - [ ] Colar em `frontend/.env.local`

### Dia 2: Ativar Autenticação (15 minutos)

- [ ] **Firebase Google OAuth**
  - [ ] Firebase Console > Authentication
  - [ ] Clicar em "Sign-in method"
  - [ ] Ativar "Google"
  - [ ] Adicionar email de suporte
  - [ ] Salvar

### Dia 3: Criar Tabelas (15 minutos)

- [ ] **Supabase SQL**
  - [ ] Ir para SQL Editor
  - [ ] Executar script de criação de tabelas (ver QUICK_START_SPRINT_1.md)
  - [ ] Validar que tabelas aparecem em "Tables"

---

## 🧪 Validar Configuração

### Backend
```bash
cd backend

# 1. Verificar arquivo .env existe
ls -la .env

# 2. Testar conexão
npm run dev

# Esperado: "🚀 Server rodando em http://localhost:3000"
# Esperado: SEM erros de credenciais

# 3. Testar health check
curl http://localhost:3000/health
# Esperado: {"status":"OK","timestamp":"..."}
```

### Frontend
```bash
cd frontend

# 1. Verificar arquivo .env.local existe
ls -la .env.local

# 2. Testar compilação
npm run dev

# Esperado: "▲ Next.js 14... ready - started server on 0.0.0.0:3001"
# Esperado: SEM erros de variáveis de ambiente

# 3. Abrir em navegador
# Esperado: http://localhost:3001 carrega sem erros
```

---

## 🔒 Segurança - Checklist

- [ ] ✅ `.env` adicionado ao `.gitignore` (NÃO commitar!)
- [ ] ✅ `.env.local` adicionado ao `.gitignore` (NÃO commitar!)
- [ ] ✅ Usar senhas diferentes para dev/prod
- [ ] ✅ Guardar credenciais em 1Password/LastPass
- [ ] ✅ NUNCA compartilhar credenciais por email/Slack
- [ ] ✅ Rotacionar API keys periodicamente (a cada 3 meses)
- [ ] ✅ Monitorar gastos (OpenAI, Supabase)

---

## 📚 Referências Rápidas

| Serviço | Link | Docs |
|---------|------|------|
| Telegram Bot | https://core.telegram.org/bots | BotFather, Token |
| OpenAI API | https://platform.openai.com | API Keys, Billing |
| Supabase | https://supabase.com | Database, Auth |
| Firebase | https://firebase.google.com | Auth, Console |

---

## 💡 Dicas

1. **Desenvolva localmente primeiro**
   - Use credenciais de DEV
   - Teste tudo antes de ir para produção

2. **Use diferentes projects para dev/prod**
   - Supabase: `porquia-dev` + `porquia-prod`
   - Firebase: `porquia-dev` + `porquia-prod`

3. **Monitore custos**
   - OpenAI: Acessar https://platform.openai.com/account/billing/overview
   - Supabase: Project Settings > Billing

4. **Salve backups das credenciais**
   - 1Password, LastPass, ou Bitwarden
   - NUNCA em arquivo .txt no PC

---

## 🆘 Troubleshooting

### "SUPABASE_KEY is required"
- ✅ Certificar que `.env` tem `SUPABASE_KEY` preenchido
- ✅ Copiar exatamente da URL (sem espaços)
- ✅ Reiniciar servidor (`npm run dev`)

### "TELEGRAM_BOT_TOKEN invalid"
- ✅ Validar que token começa com números
- ✅ Confirmar com BotFather que token está correto
- ✅ Renovar token se necessário

### "Firebase auth not working"
- ✅ Verificar que Google OAuth está ativado
- ✅ Confirmar que URL de origem está permitida
- ✅ Verificar cookies habilitados no navegador

### "401 Unauthorized from Supabase"
- ✅ Usar `SUPABASE_SECRET_KEY` no backend (não pública)
- ✅ Validar que chave não expirou
- ✅ Confirmar region correta

---

## 🚀 Próximos Passos

1. ✅ Preencher `.env` e `.env.local`
2. ✅ Executar `npm run dev` em ambos
3. ✅ Acessar http://localhost:3001
4. ✅ Começar Sprint 2 (Bot Telegram)

---

**Última atualização:** 2026-06-12  
**Status:** ✅ Completo e testado
