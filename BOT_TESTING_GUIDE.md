# 🤖 Guia de Teste do Bot Telegram + Integração de Dados Reais

## 🎯 O que foi alterado

### Frontend
- ✅ **Avatares agora têm fallback automático** — se a foto do Firebase não carregar, mostra iniciais com gradiente
- ✅ **Dashboard conectado aos dados reais** — usa hooks `useSummary()`, `useBudgets()`, `useTransactions()` 
- ✅ **Todas as páginas já consomem API** — transações, orçamentos, investimentos, assinaturas consomem dados reais

### Backend  
- ✅ **Firebase Admin SDK v14** — atualizado conforme CLAUDE.md (Sprint 5)
- ⏳ **Bot Telegram** — pronto pra receber comandos

---

## 🚀 Setup e Teste Rápido

### 1. Verificar se Firebase Admin está funcionando

```bash
cd backend && npm run dev
```

Procure por esta linha:
```
✓ Firebase Admin inicializado com credenciais de serviço
```

Se der erro sobre `FIREBASE_PRIVATE_KEY`, volte ao [backend/.env](backend/.env) e **confirme que a chave não tem espaços extras antes das aspas**.

### 2. Testar Backend Localmente

```bash
# Terminal 1: Backend rodando
curl http://localhost:3000/health
# Deve retornar: {"status":"OK","timestamp":"..."}

# Terminal 2: Testar criar transação (sem autenticação por enquanto, usando x-chat-id)
curl -X POST http://localhost:3000/api/transactions \
  -H "x-chat-id: 12345" \
  -H "Content-Type: application/json" \
  -d '{"message":"gastei 50 no mercado"}'
```

Esperado: retorna uma transação criada com categoria `alimentação` detectada pela IA.

### 3. Testar Frontend Localmente

```bash
# Terminal 3: Frontend
cd frontend && npm run dev
```

Abra `http://localhost:3001` (ou a porta que o Next usar):
- **Login** com sua conta Google
- **Dashboard** — deve mostrar dados reais quando o backend está rodando
- Se o backend está down, mostra dados mock (fallback automático)

---

## 💬 Como Testar o Bot Telegram

### Pré-requisitos
- ✅ Você tem `TELEGRAM_BOT_TOKEN` no [backend/.env](backend/.env)
- ✅ Bot já foi criado via BotFather

### Passos

**1. Obtenha seu Chat ID do Telegram**

- Abra Telegram e procure o bot `@userinfobot`
- Mande qualquer mensagem
- Ele retorna seu **Chat ID** (ex: `123456789`)

**2. Configure o Chat ID no Frontend**

- Abra `http://localhost:3001/settings`
- Cole o Chat ID no campo "Telegram"
- Clique "Conectar"

O frontend chama `POST /api/users/link-telegram` que salva na database.

**3. Envie mensagens para o bot**

No Telegram, procure seu bot (nome em `TELEGRAM_BOT_TOKEN` descrito no BotFather) e teste:

```
/start
Oi, registre uma transação: gastei 50 no mercado
Recebi 2000 de freelance
Almoço no restaurante 30 reais
```

Esperado: 
- Bot responde com confirmação
- Transações aparecem em `http://localhost:3001/transactions`
- Dashboard atualiza automaticamente

---

## 🔗 Fluxo Completo de Dados

```
Telegram Bot
    ↓
backend/src/bot/index.js  (recebe mensagem)
    ↓
backend/src/services/aiParser.js  (IA categoriza)
    ↓
Supabase (salva transação)
    ↓
Frontend chama GET /api/transactions (via hook useTransactions)
    ↓
Dashboard/Transações atualizam em tempo real
```

---

## 🐛 Debugging

### O bot não responde?
1. Confirme `TELEGRAM_BOT_TOKEN` está em [backend/.env](backend/.env)
2. Reinicie backend: `npm run dev`
3. Procure "started polling" nos logs

### Transações não aparecem?
1. Abra DevTools (F12) → Network
2. Procure por `GET /api/transactions`
3. Se 401: não está autenticado (verifique Firebase login)
4. Se 200 mas vazio: transações ainda não foram criadas

### Foto do usuário não carrega?
- ✅ Agora tem **fallback automático** — mostra iniciais com degradiente
- Se quiser forçar re-teste: faça login novamente (Firebase cache)

---

## ✅ Checklist de Teste

- [ ] Backend `npm run dev` roda sem erros
- [ ] `curl http://localhost:3000/health` retorna 200
- [ ] Frontend `npm run dev` carrega
- [ ] Consegue fazer login com Google
- [ ] Foto de perfil aparece (ou iniciais como fallback)
- [ ] Chat ID Telegram está linkado em Settings
- [ ] Enviou mensagem pro bot no Telegram
- [ ] Mensagem apareceu em Transações do Frontend
- [ ] Dashboard mostra dados reais (ou mocks se backend down)

---

## 📱 Próximos Passos (Sprint 6+)

- [ ] Gráficos dashboard consumindo dados reais (já estruturado, só falta props)
- [ ] Webhooks Telegram (em vez de polling)
- [ ] Notificações quando orçamento estoura
- [ ] Exportação de relatório em PDF
