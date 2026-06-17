# 🚀 Deploy em 5 Minutos

## Tá pronto? Siga esses 3 passos:

### 1️⃣ Instalar Firebase CLI (primeira vez só)
```bash
npm install -g firebase-tools
firebase login
```

### 2️⃣ Build + Deploy
```bash
cd frontend && npm run build && cd ..
firebase deploy --only hosting
```

### 3️⃣ Pronto! 🎉
```
✓ Deploy complete!
Hosting URL: https://porquia-4ab2b.web.app
```

---

## ✅ O que vai acontecer:

```
frontend/
├── npm run build
│   └── gera frontend/out/ (arquivos estáticos)
│
└── firebase deploy
    └── sobe tudo pro Firebase Hosting
        └── 🎯 seu app fica online!
```

---

## 🔗 Depois do Deploy

**Frontend:** https://porquia-4ab2b.web.app

**Backend:** Precisa rodar em outro lugar (Render, Railway, Heroku)
- Configure a URL em `frontend/.env.local`
- Adicione `NEXT_PUBLIC_API_URL=https://seu-backend.com`
- Faça o build de novo
- Redeploy

---

## 🐛 Não funcionou?

```bash
# Limpar cache
rm -rf frontend/.next frontend/out

# Refazer build
cd frontend && npm run build

# Deploy novamente
firebase deploy --only hosting
```

---

## 📊 Monitorar Deploy

https://console.firebase.google.com/project/porquia-4ab2b/hosting/deployments

---

**Pronto pra ir pro ar!** 🌍✨
