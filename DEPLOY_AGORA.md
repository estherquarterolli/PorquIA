# ⚡ Deploy AGORA - Roteiro Rápido

## 📍 Você está aqui
```
Frontend: Em localhost:3001 (rodando localmente)
Backend: Em localhost:3000 (rodando localmente)
Problema: Ambos PRECISAM estar em produção
```

---

## 🎯 META: 30 MINUTOS

### ⏱️ Render Backend: 15 min
### ⏱️ Firebase Frontend: 10 min
### ⏱️ Testes: 5 min

---

## ETAPA 1: RENDER BACKEND (15 min)

### 1️⃣ Ir para Render.com
```
Abra: https://render.com
```

### 2️⃣ Sign up com GitHub
```
[Sign up with GitHub]
(autorize o Render)
```

### 3️⃣ New Web Service
```
Dashboard → [New +] → [Web Service]
```

### 4️⃣ Selecionar repositório
```
Procure "PorquIA"
[Connect]
```

### 5️⃣ Preencher formulário
```
Name: porquia-backend
Runtime: Node
Build Command: cd backend && npm install
Start Command: cd backend && npm start
Plan: Free
```

### 6️⃣ Adicionar variáveis (15 linhas)
```
Environment Variables:
[Add Environment Variable]

TELEGRAM_BOT_TOKEN=8314446542:AAHlaswDXeUB5GVw48I4W863KOVoU3e39eE
OPENAI_API_KEY=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
SUPABASE_URL=https://tedalkhkzfrcaoaboccr.supabase.co
SUPABASE_KEY=sb_secret_-M-GaP56DXeqKfC7L6H_fw_kJM9m_Pi
OPENAI_MODEL=gpt-4o-mini
OPENAI_RATE_LIMIT=1000
FIREBASE_PROJECT_ID=porquia-4ab2b
FIREBASE_API_KEY=AIzaSyAuRFc5KlVN5hF_eRRndyXa3zZJLoKkUMU
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@porquia-4ab2b.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC6Guv3OF222HQs\nuVegH8ftI6xc+StIfyd43nUDArdu5oNS+iE9n/nF/ek+sS/BNmLAI9FHWRWEQgFU\nlPB1n02AMzEF9UtBeii4011DG327ACbzf0cafoMnQzqBcHbP9r4VRGDrsLp18s4W\n4EYK4IJuAQVUqRBbBStTR37BR436WNdQDvVneLIeluYnKkvuhKiUFvVIxKDnGe8w\nCaCpBsYC7uh0e0XmsaZ3JMIskbgHHA05PPVRM+huhRym72Ha2lpilJwM81it47Vv\ntrBc9zUvhBhbC4IwxJ23da3/BEYcackHNSM+UXpcXUMLb+pxTe2Pnprr4u12I9ka\nqb7I5iQRAgMBAAECggEACq0Dr0Vg/t2w4GXrdGiOT/i1aQn0JS8CJSlhvf/4ZNi9\nXNOzd3UHX4e+yxVf/23uwUXsufKOzOz6ZY87sgum5v1IySY2oHVxA5VAatqXXlRW\nZ6579jWesXBmWUmJz0lAwziOdMbJE34Pu3k3G2Wgpc3SL/aY1RfZUeguicjgiKVZ\n5YRGkHvE7l+cgAMcxAMqwvLyrtEmE0XT04Mqsy5ZBubVU79YEHWb3RDLMCw5wi4I\njvrP3RrgWTChmmeTZ/JCCaRR5hq9zJT8NSsaEnFaXfId3IYqJub4d+V4FMdvKKoW\nyu9AJxP0Sy0Nybr7E+q755YUNSUDq1Ovj9Lm7Cgw5wKBgQDuFdNEKMv0fcaKpKaD\nBhSFHQ1duIoWDiO/ijYxhwmBthGLuz70H+lDuxhgpk33t3TSd7GPyXUf0LLsk116\nnlYnnKYHQovilm3iweeffDelFTMxTzVsu50xfeX5aYcxkTD+c27Y+H/LDMssrVE3\n1T7O9cldZjig9JJKj7kc7ywk4wKBgQDIG9FBc1tfwCsZ/q1E7tft72Evqu7c8Luv\nvmiLviBAxsNEPPx1vlyApmryS4FY2Te1h2ai7Dxi8ogU1hpPC2ATUgue36yMpJDn\nm4EmW8yvGW6SFtTqCwVZtlkhJKfQRdEnqQ0RbP//YXSsU2B0pqBgZGFS9OHGM4Is\n07N3hqTZewKBgAipIpZIJaMvMBm7A5OglP6CoAnYvK0wtnwxOudyUhY12U2L8i5P\nOt0L4UcixZNNSSKe2Aay/V+658dTVQMw31FxkViSQyRq9HRbOWHD0wJeUw5oIzlh\nWcaDHeqEvDZBYdbfvBiIcZ2hSYLGiz3MtAwzRK/xF/5C509vCvzSdnihAoGBAKJ1\nIv+1/ZrQ0q05+8WY+qjqzMX8SgwJTPay6QF6i4jLVUATGwskTskLUov/DLXrM7Um\nhgcDL0tNh3kTESzXGVrWIyUKhnVwLUw7DTDtGlGVnhTwgE66P8/DoLytm6gU5mcC\ncd+R1IuqvSQiVI6fsFhRZkoJETruGmL2RB9nqnH9AoGBAO1TdMRhdmPs1HG4/VJb\neP/Ly2Sb5cQe57E4lOgQ8GxxRko8KRpC+qiWWs/anjXTxcrwjd8FV3zZ872Cmt6o\n5odMNCJWF8j5YS0BhrXFuGsCicygl8H+HNCubv2znT8aCjLuKENrKSy0iqk325mf\nRvm2VHZtb58maSL5VzFY6pAo\n-----END PRIVATE KEY-----\n"
CORS_ORIGIN=https://porquia-4ab2b.web.app
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000
BACKUP_FREQUENCY=daily
BACKUP_TIME=03:00
```

### 7️⃣ Deploy
```
[Create Web Service]

⏳ Aguarde 5 minutos...

✅ Você receberá:
https://porquia-backend-XXXXX.onrender.com
↑ COPIE ISTO!
```

### 8️⃣ Testar backend
```
Abra no navegador:
https://seu-backend.onrender.com/health

Deve retornar:
{"status":"OK", "database": {"status":"connected"}}
```

---

## ETAPA 2: FIREBASE FRONTEND (10 min)

### 1️⃣ Atualizar .env.local
```
Abra: frontend/.env.local

Mude:
NEXT_PUBLIC_API_URL=https://porquia-backend-XXXXX.onrender.com
                                                ↑
                                        (do Render acima)

Salve: Ctrl+S
```

### 2️⃣ Build
```
PowerShell/Terminal:

cd frontend
rm -r .next out
npm run build

⏳ Aguarde 20-30 segundos...

Deve ver: "✓ Build complete!"
```

### 3️⃣ Deploy
```
firebase deploy --only hosting

⏳ Aguarde 1-3 minutos...

✅ Você receberá:
Hosting URL: https://porquia-4ab2b.web.app
```

---

## ETAPA 3: TESTES (5 min)

### ✅ TESTE 1: Acessar app
```
Abra: https://porquia-4ab2b.web.app
Clique: [Continuar com Google]
Faça login: seu@email.com
```

### ✅ TESTE 2: Isolamento de dados
```
Conta A (Alice):
1. Crie transação "café 5"
2. Deslogue
3. Observe que a transação apareceu

Conta B (Bob):
1. Faça login com outro email
2. Clique em Transações
3. NÃO vê "café 5" ✅
4. Crie "almoço 30"

Volta para Alice:
1. Deslogue
2. Faça login novamente
3. Vê apenas "café 5" ✅
4. NÃO vê "almoço 30" ✅
```

### ✅ TESTE 3: Notificações
```
1. Clique no sino 🔔
2. Deve mostrar últimas transações
3. Crie 3+ transações em uma categoria
4. Clique no sino novamente
5. Deve mostrar alerta de orçamento
```

---

## 🎉 PRONTO!

```
✅ Backend em produção (Render)
✅ Frontend em produção (Firebase)
✅ Dados isolados por usuário
✅ Notificações funcionando
✅ App online e compartilhável
```

**URL para compartilhar:**
```
https://porquia-4ab2b.web.app
```

---

## 📖 Guias Detalhados

Se tiver dúvidas em alguma etapa:

```
Render: RENDER_DEPLOY_DETAILED.md
Firebase: FIREBASE_DEPLOY_DETAILED.md
Completo: DEPLOYMENT_COMPLETE.md
```

---

## 🆘 ERRO? 

### Opção 1: Ler guia detalhado acima
### Opção 2: Verificar logs
```bash
# Ver logs do Render
firebase deploy --debug

# Ver logs do Firebase
firebase hosting:channel:list
```

### Opção 3: Reconstruir do zero
```bash
# Se nada funcionar:
cd frontend
rm -rf .next out node_modules package-lock.json
npm install
npm run build
firebase deploy
```

---

**Comece agora! 🚀**
