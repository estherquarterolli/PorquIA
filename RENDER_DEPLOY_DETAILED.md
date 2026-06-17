# 🚀 Deploy Backend no Render - PASSO A PASSO

## ⚠️ PRÉ-REQUISITOS
- [ ] Conta GitHub com o repositório PorquIA
- [ ] Credenciais Firebase, OpenAI e Supabase (estão no `backend/.env`)

---

## PASSO 1: Criar Conta no Render

### 1.1 Acesse o site
```
https://render.com
```

### 1.2 Clique no botão "Sign Up" (canto superior direito)

### 1.3 Escolha "Continue with GitHub"
```
┌─────────────────────────┐
│ Sign up with GitHub     │ ← CLIQUE AQUI
│ Sign up with Google     │
│ Sign up with GitLab     │
└─────────────────────────┘
```

### 1.4 Autorize o Render a acessar sua conta GitHub
- GitHub pedirá: "Render wants to access your account"
- Clique em "Authorize render"

### 1.5 Escolha nome de usuário e senha
```
Username: seu-nome-aqui
Email: seu-email@gmail.com
Password: qualquer senha segura
```

✅ **Pronto! Você está logado no Render**

---

## PASSO 2: Conectar Repositório GitHub

### 2.1 No dashboard do Render, procure por "Connect a repository"
```
┌────────────────────────────────────┐
│  Dashboard                          │
│                                    │
│  [Connect a repository]            │
│                                    │
└────────────────────────────────────┘
```

### 2.2 Clique em "Connect account"
```
GitHub App Authorization:
[Connect GitHub account] ← CLIQUE AQUI
```

### 2.3 Selecione "PorquIA" na lista
```
Suas repositories aparecerão:
□ PorquIA  ← CLIQUE AQUI
□ OutroRepo
□ MaisRepo
```

### 2.4 Clique em "Connect"
```
PorquIA
[Select] [Connect] ← CLIQUE EM "Connect"
```

✅ **Agora o Render está conectado ao seu repositório GitHub**

---

## PASSO 3: Criar Web Service (Servidor)

### 3.1 No dashboard, clique em "New +"
```
┌──────────────────┐
│ [New +]          │ ← CLIQUE AQUI
│                  │
│ Dashboard        │
└──────────────────┘
```

### 3.2 Escolha "Web Service"
```
┌─────────────────────────┐
│ New Web Service         │ ← CLIQUE AQUI
│ New Static Site         │
│ New Cron Job            │
│ New Private Service     │
└─────────────────────────┘
```

### 3.3 Selecione o repositório "PorquIA"
```
Conecte um repositório:
○ GitHub account não conectada
● GitHub account conectada
  [PorquIA] ← CLIQUE AQUI (aparecerá a opcão)
```

✅ **Você selecionou o repositório**

---

## PASSO 4: Configurar Web Service

Agora você verá um formulário grande. Preencha assim:

### 4.1 Nome do Serviço
```
Name: porquia-backend
      ↑
      (cole exatamente isso)
```

### 4.2 Runtime (Linguagem)
```
Runtime: Node
         ↑
         (dropdown, selecione "Node")
```

### 4.3 Branch
```
Branch: main
        ↑
        (já vem selecionado)
```

### 4.4 Build Command
```
Build Command:
cd backend && npm install
            ↑
            (cole exatamente isso)
```

### 4.5 Start Command
```
Start Command:
cd backend && npm start
            ↑
            (cole exatamente isso)
```

### 4.6 Plano (Plan)
```
Free tier: Gratuito por 750 horas/mês
           (suficiente para 1 app rodando 24/7)
           
Standard: $7/mês
          
Clique em "Free" ou seu preferido
```

---

## PASSO 5: Adicionar Variáveis de Ambiente ⚙️

### 5.1 Procure a seção "Environment" ou "Environment Variables"
```
┌─────────────────────────────────┐
│ Environment Variables            │
│                                 │
│ [Add Environment Variable]      │
│                                 │
└─────────────────────────────────┘
```

### 5.2 Para CADA variável abaixo, clique "Add Environment Variable"

**COPIE E COLE estas exatamente (encontre no `backend/.env`):**

#### Variável 1:
```
Key: TELEGRAM_BOT_TOKEN
Value: 8314446542:AAHlaswDXeUB5GVw48I4W863KOVoU3e39eE

[Add] ← quando terminar de copiar
```

#### Variável 2:
```
Key: OPENAI_API_KEY
Value: SUA_OPENAI_API_KEY

[Add]
```

#### Variável 3:
```
Key: SUPABASE_URL
Value: https://tedalkhkzfrcaoaboccr.supabase.co

[Add]
```

#### Variável 4:
```
Key: SUPABASE_KEY
Value: SUA_SUPABASE_KEY

[Add]
```

#### Variável 5:
```
Key: OPENAI_MODEL
Value: gpt-4o-mini

[Add]
```

#### Variável 6:
```
Key: OPENAI_RATE_LIMIT
Value: 1000

[Add]
```

#### Variável 7:
```
Key: FIREBASE_PROJECT_ID
Value: porquia-4ab2b

[Add]
```

#### Variável 8:
```
Key: FIREBASE_API_KEY
Value: AIzaSyAuRFc5KlVN5hF_eRRndyXa3zZJLoKkUMU

[Add]
```

#### Variável 9:
```
Key: FIREBASE_CLIENT_EMAIL
Value: firebase-adminsdk-fbsvc@porquia-4ab2b.iam.gserviceaccount.com

[Add]
```

#### Variável 10: ⚠️ IMPORTANTE - CUIDADO COM QUEBRAS DE LINHA
```
Key: FIREBASE_PRIVATE_KEY
Value: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC6Guv3OF222HQs\nuVegH8ftI6xc+StIfyd43nUDArdu5oNS+iE9n/nF/ek+sS/BNmLAI9FHWRWEQgFU\nlPB1n02AMzEF9UtBeii4011DG327ACbzf0cafoMnQzqBcHbP9r4VRGDrsLp18s4W\n4EYK4IJuAQVUqRBbBStTR37BR436WNdQDvVneLIeluYnKkvuhKiUFvVIxKDnGe8w\nCaCpBsYC7uh0e0XmsaZ3JMIskbgHHA05PPVRM+huhRym72Ha2lpilJwM81it47Vv\ntrBc9zUvhBhbC4IwxJ23da3/BEYcackHNSM+UXpcXUMLb+pxTe2Pnprr4u12I9ka\nqb7I5iQRAgMBAAECggEACq0Dr0Vg/t2w4GXrdGiOT/i1aQn0JS8CJSlhvf/4ZNi9\nXNOzd3UHX4e+yxVf/23uwUXsufKOzOz6ZY87sgum5v1IySY2oHVxA5VAatqXXlRW\nZ6579jWesXBmWUmJz0lAwziOdMbJE34Pu3k3G2Wgpc3SL/aY1RfZUeguicjgiKVZ\n5YRGkHvE7l+cgAMcxAMqwvLyrtEmE0XT04Mqsy5ZBubVU79YEHWb3RDLMCw5wi4I\njvrP3RrgWTChmmeTZ/JCCaRR5hq9zJT8NSsaEnFaXfId3IYqJub4d+V4FMdvKKoW\nyu9AJxP0Sy0Nybr7E+q755YUNSUDq1Ovj9Lm7Cgw5wKBgQDuFdNEKMv0fcaKpKaD\nBhSFHQ1duIoWDiO/ijYxhwmBthGLuz70H+lDuxhgpk33t3TSd7GPyXUf0LLsk116\nnlYnnKYHQovilm3iweeffDelFTMxTzVsu50xfeX5aYcxkTD+c27Y+H/LDMssrVE3\n1T7O9cldZjig9JJKj7kc7ywk4wKBgQDIG9FBc1tfwCsZ/q1E7tft72Evqu7c8Luv\nvmiLviBAxsNEPPx1vlyApmryS4FY2Te1h2ai7Dxi8ogU1hpPC2ATUgue36yMpJDn\nm4EmW8yvGW6SFtTqCwVZtlkhJKfQRdEnqQ0RbP//YXSsU2B0pqBgZGFS9OHGM4Is\n07N3hqTZewKBgAipIpZIJaMvMBm7A5OglP6CoAnYvK0wtnwxOudyUhY12U2L8i5P\nOt0L4UcixZNNSSKe2Aay/V+658dTVQMw31FxkViSQyRq9HRbOWHD0wJeUw5oIzlh\nWcaDHeqEvDZBYdbfvBiIcZ2hSYLGiz3MtAwzRK/xF/5C509vCvzSdnihAoGBAKJ1\nIv+1/ZrQ0q05+8WY+qjqzMX8SgwJTPay6QF6i4jLVUATGwskTskLUov/DLXrM7Um\nhgcDL0tNh3kTESzXGVrWIyUKhnVwLUw7DTDtGlGVnhTwgE66P8/DoLytm6gU5mcC\ncd+R1IuqvSQiVI6fsFhRZkoJETruGmL2RB9nqnH9AoGBAO1TdMRhdmPs1HG4/VJb\neP/Ly2Sb5cQe57E4lOgQ8GxxRko8KRpC+qiWWs/anjXTxcrwjd8FV3zZ872Cmt6o\n5odMNCJWF8j5YS0BhrXFuGsCicygl8H+HNCubv2znT8aCjLuKENrKSy0iqk325mf\nRvm2VHZtb58maSL5VzFY6pAo\n-----END PRIVATE KEY-----\n"

[Add]
```

#### Variável 11:
```
Key: CORS_ORIGIN
Value: https://porquia-4ab2b.web.app

[Add]
```

#### Variável 12:
```
Key: RATE_LIMIT_REQUESTS
Value: 100

[Add]
```

#### Variável 13:
```
Key: RATE_LIMIT_WINDOW_MS
Value: 60000

[Add]
```

#### Variável 14:
```
Key: BACKUP_FREQUENCY
Value: daily

[Add]
```

#### Variável 15:
```
Key: BACKUP_TIME
Value: 03:00

[Add]
```

---

## PASSO 6: Deploy! 🚀

### 6.1 Scroll para o final da página

### 6.2 Clique em "Create Web Service"
```
┌──────────────────────────┐
│ [Create Web Service]     │ ← CLIQUE AQUI
│                          │
│ Isso vai custar $0       │
│ (Free tier)              │
└──────────────────────────┘
```

### 6.3 Aguarde o deploy (3-5 minutos)
```
Você verá:
✓ Building...
✓ Deploying...
✓ Deploy complete!

Hosting URL:
https://porquia-backend-xxxx.onrender.com
      ↑ COPIE ESTA URL!
```

---

## PASSO 7: Pegar a URL do Seu Backend

Quando o deploy terminar, você verá algo como:

```
Service: porquia-backend
Status: Live ✅

URL: https://porquia-backend-abc123.onrender.com
     ↑ COPIE ISTO!
```

### 7.1 Clique no URL para testar
```
https://porquia-backend-abc123.onrender.com/health

Deve retornar:
{
  "status": "OK",
  "timestamp": "2026-06-17T10:30:45.123Z",
  "uptime_s": 125,
  "database": {
    "status": "connected",
    "latency_ms": 45
  }
}
```

✅ **Se vir "OK", seu backend está online!**

---

## 🎯 Próximo Passo

Com a URL do seu backend (ex: `https://porquia-backend-abc123.onrender.com`), você vai:

### 1. Atualizar `frontend/.env.local`
```bash
NEXT_PUBLIC_API_URL=https://porquia-backend-abc123.onrender.com
```

### 2. Fazer build e deploy no Firebase
```bash
cd frontend && npm run build
firebase deploy --only hosting
```

---

## 🆘 Problemas Comuns

### "Deploy failed"
❌ Build Command errado
✅ Verifique: `cd backend && npm install`

### "Service URL not working"
❌ Aguarde 5 minutos (primeira inicialização é lenta)
✅ Tente novamente: `curl https://seu-url/health`

### "502 Bad Gateway"
❌ Backend crashou (problema nas variáveis)
✅ Clique em "Logs" para ver o erro
✅ Verifique FIREBASE_PRIVATE_KEY (quebras de linha!)

### "Environment variables não aparecem"
❌ Não clicou em "Add" após cada variável
✅ Clique em "Add" para cada uma

---

## ✅ Checklist Final

- [ ] Conta Render criada
- [ ] GitHub conectado
- [ ] Web Service "porquia-backend" criado
- [ ] Todas as 15 variáveis adicionadas
- [ ] Deploy completo (URL visível)
- [ ] `/health` retorna "OK"
- [ ] URL copiada (para próximo passo)

**Pronto para atualizar o frontend!** 🎉
