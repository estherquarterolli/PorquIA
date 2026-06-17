# 🚀 Guia Completo de Deploy - PorquIA

## O Problema Atual
Frontend está no Firebase mas apontando para `http://localhost:3000` (backend local). Precisamos:
1. **Deploy do Backend** em produção (Render, Railway, Heroku, etc)
2. **Atualizar .env.local** do frontend com URL do backend
3. **Deploy do Frontend** no Firebase Hosting

---

## 📋 PASSO 1: Deploy do Backend (Render.com — GRÁTIS)

### 1.1 Criar conta no Render
1. Acesse https://render.com
2. Clique em "Sign up"
3. Escolha "Sign up with GitHub" (mais fácil)
4. Conecte sua conta GitHub

### 1.2 Deploy do Backend
1. No dashboard do Render, clique em **"New +"** → **"Web Service"**
2. Procure pelo repositório `PorquIA`
3. Configure:
   - **Name:** `porquia-backend`
   - **Runtime:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`

### 1.3 Adicionar Variáveis de Ambiente
Na página de configuração, clique em **"Environment"** e adicione todas as variáveis do `backend/.env`:

```
TELEGRAM_BOT_TOKEN=8314446542:AAHlaswDXeUB5GVw48I4W863KOVoU3e39eE
OPENAI_API_KEY=sk-proj-...
SUPABASE_URL=https://tedalkhkzfrcaoaboccr.supabase.co
SUPABASE_KEY=sb_secret_...
OPENAI_MODEL=gpt-4o-mini
OPENAI_RATE_LIMIT=1000
FIREBASE_PROJECT_ID=porquia-4ab2b
FIREBASE_API_KEY=AIzaSyAuRFc5KlVN5hF_eRRndyXa3zZJLoKkUMU
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@porquia-4ab2b.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...n-----END PRIVATE KEY-----\n"
CORS_ORIGIN=https://porquia-4ab2b.web.app
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000
BACKUP_FREQUENCY=daily
BACKUP_TIME=03:00
```

### 1.4 Deploy
Clique em **"Create Web Service"** e aguarde ~5 minutos. Você receberá uma URL como:
```
https://porquia-backend.onrender.com
```

**Anote esta URL!** ✅

---

## 📋 PASSO 2: Atualizar Frontend com URL do Backend

### 2.1 Atualizar variáveis de ambiente local
Edite `frontend/.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAuRFc5KlVN5hF_eRRndyXa3zZJLoKkUMU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=porquia-4ab2b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=porquia-4ab2b
NEXT_PUBLIC_FIREBASE_APP_ID=1:XXXX:web:XXXX
NEXT_PUBLIC_API_URL=https://porquia-backend.onrender.com
```

### 2.2 Validar que funciona localmente
```bash
cd frontend
npm run dev
```

Acesse http://localhost:3001 e teste:
1. Login com Google ✅
2. Adicionar transação (Telegram) ✅
3. Ver dados do seu usuário ✅

---

## 📋 PASSO 3: Deploy do Frontend (Firebase Hosting)

### 3.1 Build
```bash
cd frontend
npm run build
```

Verifica se tudo compilou (leva ~20s)

### 3.2 Deploy
```bash
firebase deploy --only hosting
```

Espera a URL de sucesso:
```
✓ Deploy complete!
Hosting URL: https://porquia-4ab2b.web.app
```

---

## ✅ Testes Finais

Acesse https://porquia-4ab2b.web.app e teste:

### Login com 2 contas Google diferentes
```
Conta A:
- Email: user-a@gmail.com
- Cria transação "café 5 reais"
- Vê dados APENAS de user-a ✅

Conta B:
- Email: user-b@gmail.com
- Cria transação "almoço 30 reais"
- Vê dados APENAS de user-b ✅
- NÃO vê dados de user-a ✅
```

### Testar Notificações
1. Crie 3+ transações em uma categoria
2. Clique no sino 🔔
3. Deve mostrar:
   - ✅ Orçamentos em risco (>70% gasto)
   - ✅ Últimas 3 transações com categoria

---

## 🔧 Troubleshooting

### "Erro 401 - Autenticação necessária"
- ❌ Variáveis de environment não foram atualizadas
- ✅ Reconstruir: `npm run build && firebase deploy`

### "Dashboard mostra dados de outro usuário"
- ❌ Servidor backend local ainda está rodando
- ✅ Parar servidor local: `Ctrl+C` no terminal
- ✅ Verificar CORS_ORIGIN no Render inclui Firebase URL

### "Notificações não aparecem"
- ❌ Dados não estão sendo buscados
- ✅ Abrir DevTools → Network → verificar se `/api/transactions` retorna dados

---

## 📊 Arquitetura Após Deploy

```
User (Frontend)
    ↓
https://porquia-4ab2b.web.app (Firebase Hosting)
    ↓
Authorization Header: Bearer {Firebase Token}
    ↓
https://porquia-backend.onrender.com/api/
    ↓
Middleware: Verifica Token Firebase
    ↓
req.userId = Google UID do usuário autenticado
    ↓
SELECT * FROM transactions WHERE user_id = req.userId
    ↓
Retorna APENAS dados daquele usuário ✅
```

---

## 🎯 Resumo

| Etapa | Plataforma | URL | Status |
|-------|-----------|-----|--------|
| Backend | Render | https://porquia-backend.onrender.com | 🟢 Deploy |
| Frontend | Firebase | https://porquia-4ab2b.web.app | 🟢 Deploy |
| Database | Supabase | Conectado via Backend | ✅ |
| Auth | Firebase | Bearer Token | ✅ |

---

## ❓ Dúvidas?

Se algo não funcionar:
1. Verificar logs: `firebase deploy --debug`
2. Verificar backend: `curl https://porquia-backend.onrender.com/health`
3. Abrir DevTools do navegador (F12) → Network → verificar requisições

**Pronto para produção!** 🚀
