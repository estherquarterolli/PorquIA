# 🚀 Deploy Frontend no Firebase - PASSO A PASSO

## ⚠️ PRÉ-REQUISITOS
- [ ] URL do backend do Render (ex: `https://porquia-backend-abc123.onrender.com`)
- [ ] Firebase CLI instalado (`firebase --version` deve retornar versão)
- [ ] Logado no Firebase CLI (`firebase login` já feito)

---

## PASSO 1: Atualizar Arquivo de Configuração

### 1.1 Abra o arquivo `frontend/.env.local`
```
Caminho: c:\Users\esther.santos\Documents\GitHub\PorquIA\frontend\.env.local
```

### 1.2 Encontre a linha `NEXT_PUBLIC_API_URL`
```
Antes:
NEXT_PUBLIC_API_URL=http://localhost:3000

Depois:
NEXT_PUBLIC_API_URL=https://porquia-backend-XXXXX.onrender.com
                                           ↑
                                    (sua URL do Render)
```

### 1.3 SALVE o arquivo (Ctrl+S)

---

## PASSO 2: Build do Frontend

### 2.1 Abra o terminal
```
PowerShell / Git Bash / cmd
```

### 2.2 Navegue até a pasta frontend
```bash
cd c:\Users\esther.santos\Documents\GitHub\PorquIA\frontend
```

### 2.3 Limpe cache anterior (IMPORTANTE!)
```bash
rm -r .next out
```

Ou no PowerShell:
```powershell
Remove-Item .next -Recurse -Force
Remove-Item out -Recurse -Force
```

### 2.4 Execute o build
```bash
npm run build
```

**Isso pode levar 20-30 segundos.**

Você deve ver:
```
✓ Compiled successfully
✓ Running TypeScript...
✓ Generating static pages...
✓ Build complete!

Route (app)
├ ○ /
├ ○ /dashboard
├ ○ /login
├ ○ /budgets
├ ○ /transactions
└ ○ /...

○ (Static) prerendered as static content
```

✅ **Se vir isso, o build funcionou!**

---

## PASSO 3: Deploy no Firebase

### 3.1 Verifique se está logado no Firebase
```bash
firebase login --list
```

Você deve ver seu email:
```
✓ estherquarterollii@gmail.com
```

Se não estiver logado:
```bash
firebase login
```

### 3.2 Verifique qual projeto será deployado
```bash
firebase projects:list
```

Deve mostrar:
```
✓ porquia-4ab2b (current)
```

Se o projeto errado estiver selecionado:
```bash
firebase use porquia-4ab2b
```

### 3.3 Execute o deploy
```bash
firebase deploy --only hosting
```

**Isso pode levar 1-3 minutos.**

---

## PASSO 4: Aguardar Resultado

### 4.1 Você verá algo assim:
```
=== Deploying to 'porquia-4ab2b'...

i  deploying hosting
i  uploading new files to Cloud Storage (234 files)
✓  Cloud Functions code is up to date.
i  finalizing deployment...

✓  Deploy complete!

Project Console: https://console.firebase.google.com/project/porquia-4ab2b
Hosting URL: https://porquia-4ab2b.web.app
```

### 4.2 COPIE a URL de Hosting
```
https://porquia-4ab2b.web.app
↑ ESTA É SUA URL!
```

✅ **Seu frontend está online!**

---

## PASSO 5: Testar o Deploy

### 5.1 Abra no navegador
```
https://porquia-4ab2b.web.app
```

### 5.2 Você deve ver:
```
┌────────────────────────────────┐
│ PorquIA - Bem-vindo ao PorquIA │
│ [Continuar com Google]         │
└────────────────────────────────┘
```

### 5.3 Faça login com Google
1. Clique em "Continuar com Google"
2. Escolha sua conta Google
3. Autorize o PorquIA

---

## PASSO 6: Testar Isolamento de Dados

### TESTE 1: Login com 1ª Conta
```bash
1. Faça login com: alice@gmail.com
2. Você vê dashboard vazio (nenhuma transação)
3. Clique em "Transações"
4. Escreva: "café 5 reais"
5. Clique em "Registrar"
6. Você vê a transação registrada ✅
```

### TESTE 2: Sair e logar com 2ª Conta
```bash
1. Clique no avatar (canto superior direito)
2. Clique em "Sair da conta"
3. Faça login com: bob@gmail.com
4. Clique em "Transações"
5. NÃO vê a transação "café 5 reais" de Alice ✅
6. Escreva: "almoço 30 reais"
7. Clique em "Registrar"
8. Você vê APENAS a transação do Bob ✅
```

### TESTE 3: Voltar para 1ª Conta
```bash
1. Sair da conta (Bob)
2. Fazer login novamente (Alice)
3. Clique em "Transações"
4. Vê APENAS "café 5 reais" ✅
5. NÃO vê "almoço 30 reais" do Bob ✅
```

✅ **ISOLAMENTO DE DADOS FUNCIONANDO!**

---

## PASSO 7: Testar Notificações

### 7.1 No dashboard, clique no sino 🔔
```
Você deve ver:
┌────────────────────┐
│ Notificações       │
│                    │
│ Últimas transações │
│ • Café             │
│ • Outro...         │
└────────────────────┘
```

### 7.2 Crie mais 3 transações
```bash
1. Vá para Transações
2. Digite: "pão 10"
3. Registre
4. Digite: "leite 8"
5. Registre
6. Digite: "manteiga 12"
7. Registre
```

### 7.3 Clique no sino novamente
```
Deve mostrar as 3 últimas transações
(Com emoji, descrição, valor)
```

✅ **NOTIFICAÇÕES FUNCIONANDO!**

---

## PASSO 8: Testar Orçamentos (Opcional)

### 8.1 Vá para "Orçamentos"
```
Menu lateral → Orçamentos
```

### 8.2 Crie um orçamento
```
Categoria: alimentação
Limite: R$ 50,00

Clique em "Criar Orçamento"
```

### 8.3 Crie transações até ultrapassar 70%
```bash
Se o limite é R$50:
- Digite: "compra mercado 20"
- Digite: "compra mercado 20"
- Digite: "compra mercado 15"
Total: R$55 (110% do orçamento)
```

### 8.4 Clique no sino 🔔
```
Deve aparecer:
┌────────────────────┐
│ Orçamentos em alerta│
│ ⚠️ alimentação     │
│ 110% do orçamento  │
└────────────────────┘
```

✅ **ALERTAS DE ORÇAMENTO FUNCIONANDO!**

---

## 🆘 Problemas Comuns

### "Erro: Firebase project not found"
❌ Projeto Firebase não está configurado
✅ Execute: `firebase use porquia-4ab2b`

### "Build failed"
❌ Arquivo `.env.local` com erro
✅ Verifique:
```bash
NEXT_PUBLIC_API_URL=https://porquia-backend-xxxx.onrender.com
(sem http://, com https://)
```

### "403 Forbidden ao fazer requisição"
❌ Backend está offline ou CORS está bloqueado
✅ Teste o backend:
```bash
curl https://seu-backend.onrender.com/health
```

### "Dados ainda vindo de mock"
❌ Build não foi feito após atualizar .env.local
✅ Execute novamente:
```bash
npm run build
firebase deploy --only hosting
```

### "Login não funciona"
❌ Firebase credentials ausentes
✅ Verifique `frontend/.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=porquia-4ab2b
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

---

## 📊 Verificar Status do Deploy

### Opção 1: Firebase Console
```
https://console.firebase.google.com/project/porquia-4ab2b/hosting/deployments
```

Você verá:
```
Deploy #123 (Latest)
Status: ✅ Complete
Uploaded: 234 files
Date: 17 de jun, 10:30
```

### Opção 2: Terminal
```bash
firebase hosting:channel:list
firebase hosting:sites:list
```

---

## ✅ Checklist Final

- [ ] `.env.local` atualizado com URL do Render
- [ ] Cache limpo (`.next` e `out` removidos)
- [ ] Build executado com sucesso
- [ ] Deploy no Firebase concluído
- [ ] URL acessível: https://porquia-4ab2b.web.app
- [ ] Login com Google funciona
- [ ] Isolamento de dados funciona (2 contas diferentes)
- [ ] Notificações aparecem
- [ ] Transações são criadas e salvas

---

## 🎉 SUCESSO!

Seu app está **100% em produção**:
- ✅ Frontend: Firebase Hosting
- ✅ Backend: Render
- ✅ Database: Supabase
- ✅ Auth: Firebase
- ✅ Dados isolados por usuário
- ✅ Notificações funcionando

**Compartilhe:** https://porquia-4ab2b.web.app 🚀

---

## 📞 Próximas Melhorias

Agora que está tudo em produção, você pode:
1. Integrar bot Telegram (já está pronto!)
2. Adicionar mais gráficos
3. Implementar investimentos
4. Adicionar assinaturas
5. Melhorias de UI/UX

Consulte `CLAUDE.md` para a roadmap completa!
