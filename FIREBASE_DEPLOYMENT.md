# 🚀 Guia: Deploy do PorquIA no Firebase Hosting

## 📋 Pré-requisitos

- ✅ Conta Google
- ✅ Projeto Firebase criado (você já tem: `porquia-4ab2b`)
- ✅ CLI do Firebase instalado

```bash
npm install -g firebase-tools
```

---

## ⚙️ Passo 1: Configurar Firebase CLI

```bash
firebase login
# Abre navegador para autenticar com sua conta Google
```

Depois configure o projeto:

```bash
cd c:/Users/esther.santos/Documents/GitHub/PorquIA
firebase init
```

Escolha as opções:
```
? Which Firebase features do you want to set up for this directory?
  ◉ Hosting: Configure files for Firebase Hosting

? Please select an option
  ◉ Use an existing project

? Select a default Firebase project for this directory:
  ◉ porquia-4ab2b (PorquIA)

? What do you want to use as your public directory?
  frontend/out

? Configure as a single-page app (rewrite all urls to index.html)?
  ◉ Yes

? Set up automatic builds and deploys with GitHub?
  ◉ No (por enquanto)

? File frontend/out already exists. Overwrite?
  ◉ No
```

---

## 🏗️ Passo 2: Configurar Frontend para Build Estático

O Firebase Hosting requer arquivos estáticos. Next.js usa SSR por padrão, mas podemos fazer build estático.

**Verifique o `next.config.ts`:**

```bash
cat frontend/next.config.ts
```

Se não existe ou está vazio, crie:

```typescript
// frontend/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // ← Build estático!
  reactStrictMode: true,
};

export default nextConfig;
```

---

## 🔨 Passo 3: Build do Frontend

```bash
cd frontend
npm run build
```

Deve gerar uma pasta `out/` com arquivos estáticos.

```bash
ls out/
# Deve mostrar: _next, index.html, dashboard, login, etc
```

---

## 🌐 Passo 4: Deploy no Firebase Hosting

```bash
cd c:/Users/esther.santos/Documents/GitHub/PorquIA
firebase deploy --only hosting
```

Vai fazer upload de tudo para Firebase e exibir a URL:

```
✓ Deploy complete!

Project Console: https://console.firebase.google.com/project/porquia-4ab2b
Hosting URL: https://porquia-4ab2b.web.app
```

---

## 🔒 Passo 5: Configurar Variáveis de Ambiente (Importante!)

No Firebase Hosting, as variáveis de ambiente do `.env.local` **não são enviadas** (por segurança).

**Opção A: Build com variáveis (recomendado)**

```bash
cd frontend

# Copie as variáveis públicas para .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAuRFc5KlVN5hF_eRRndyXa3zZJLoKkUMU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=porquia-4ab2b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=porquia-4ab2b
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456
NEXT_PUBLIC_API_URL=https://seu-backend-url.com
EOF

npm run build
```

**Opção B: Configurar via Firebase Console**

1. Abra https://console.firebase.google.com/project/porquia-4ab2b
2. Vá para **Hosting** → **Configuração**
3. Adicione as variáveis de ambiente lá

---

## 🔗 Passo 6: Apontar Backend (Importante!)

O frontend precisa saber a URL do backend. Você tem duas opções:

### Opção A: Backend no Render/Heroku/Railway (recomendado)

```bash
# Ao fazer build, configure
export NEXT_PUBLIC_API_URL=https://seu-backend.onrender.com
npm run build
firebase deploy
```

### Opção B: Backend rodando localmente (só para teste)

Não funciona em produção porque Firebase Hosting (cliente) não consegue acessar `localhost:3000`.

---

## 📱 Passo 7: Testar em Produção

1. Acesse https://porquia-4ab2b.web.app
2. Faça login com sua conta Google
3. Veja se aparecem os dados (se backend estiver rodando)
4. Teste o banner do Telegram

---

## 🔄 Automatizar Deploys Futuro (CI/CD)

### GitHub Actions (Recomendado)

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: cd frontend && npm install
      
      - name: Build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
        run: cd frontend && npm run build
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          projectId: porquia-4ab2b
          channelId: live
```

Depois:
1. Gere uma chave de serviço no Firebase Console
2. Adicione como secret do GitHub: `FIREBASE_SERVICE_ACCOUNT`

---

## 🛠️ Troubleshooting

### "NEXT_PUBLIC_* não está definido"
```bash
echo $NEXT_PUBLIC_FIREBASE_API_KEY
# Se vazio, defina antes do build:
export NEXT_PUBLIC_FIREBASE_API_KEY=seu_valor
```

### "Cannot GET /dashboard"
Você configurou `rewrite all urls to index.html`? Verifique `firebase.json`:

```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### "Conexão recusada ao backend"
- Backend não está rodando
- URL do backend está errada
- Backend não tem CORS configurado para sua URL do Firebase

---

## 📊 Checklist Final

- [ ] Firebase CLI instalado e logado
- [ ] `firebase init` rodou
- [ ] `next.config.ts` tem `output: "export"`
- [ ] `npm run build` roda sem erros
- [ ] Pasta `frontend/out/` existe
- [ ] `firebase deploy` completou com sucesso
- [ ] Acessei https://porquia-4ab2b.web.app e fiz login
- [ ] Banner do Telegram aparece
- [ ] Dados aparecem se backend está rodando

---

## 🚀 URLs Finais

- **Frontend:** https://porquia-4ab2b.web.app
- **Admin:** https://console.firebase.google.com/project/porquia-4ab2b
- **Logs:** https://console.firebase.google.com/project/porquia-4ab2b/hosting/deployments

