# 📊 Plano de Sprints - Rastreador Financeiro

## 📋 Estrutura Geral
**Duração Total:** 10-12 semanas (2-3 meses)  
**Sprint Duration:** 1 semana cada  
**Equipe:** 1 Dev Node.js senior  
**Metodologia:** Agile com ciclos curtos de validação

---

## 🚀 SPRINT 1: Setup & Infraestrutura (Semana 1)
**Objetivo:** Configurar ambiente, ferramentas e templates iniciais  
**Dependências:** Nenhuma  
**Duração:** 1 semana

### Tarefas

| # | Tarefa | Subtarefa | Tempo | Status |
|---|--------|-----------|-------|--------|
| 1.1 | Configurar repositório Git | Criar repositório, branches (dev/main), .gitignore | 1h | ⬜ |
| 1.2 | Setup do Backend Node.js | Criar pasta `/backend`, npm init, instalar dependências base | 2h | ⬜ |
| 1.3 | Instalar dependências core | `express`, `dotenv`, `cors`, `axios` | 1h | ⬜ |
| 1.4 | Configurar variáveis de ambiente | Criar `.env.example`, setup de secrets | 1h | ⬜ |
| 1.5 | Setup do Frontend Next.js | `npx create-next-app`, remover boilerplate | 2h | ⬜ |
| 1.6 | Instalar dependências de UI | TailwindCSS, shadcn/ui, Recharts | 2h | ⬜ |
| 1.7 | Criar estrutura de pastas | `/api`, `/components`, `/pages`, `/lib`, `/utils` | 1h | ⬜ |
| 1.8 | Criar conta/token Telegram | BotFather, guardar token em `.env` | 1h | ⬜ |
| 1.9 | Criar conta Supabase | Setup projeto, copiar URL e key em `.env` | 1h | ⬜ |
| 1.10 | Documentar stack no README | Versões das libs, links dos serviços, instruções de setup | 1h | ⬜ |

**Resultado entregável:** Ambiente pronto para código, repositório estruturado, todas as contas criadas

**Checklist de validação:**
- [ ] `npm start` funciona no backend (porta 3000)
- [ ] `npm run dev` funciona no frontend (porta 3001)
- [ ] Variáveis de ambiente carregam sem erro
- [ ] Git commits iniciais feitos

---

## 🤖 SPRINT 2: Bot do Telegram + Parser IA (Semana 2)
**Objetivo:** Receber mensagens no Telegram e extrair dados via IA  
**Dependências:** Sprint 1 ✅  
**Duração:** 1 semana

### Tarefas

| # | Tarefa | Subtarefa | Tempo | Status |
|---|--------|-----------|-------|--------|
| 2.1 | Instalar Telegraf | `npm install telegraf` no backend | 30m | ⬜ |
| 2.2 | Criar arquivo bot base | `/backend/src/bot.js` com listener simples | 1h | ⬜ |
| 2.3 | Testar webhook/polling | Validar que bot recebe mensagens no Telegram | 1h | ⬜ |
| 2.4 | Criar prompt de sistema IA | Escrever prompt para GPT-4o-mini extrair JSON | 1.5h | ⬜ |
| 2.5 | Integrar OpenAI API | `npm install openai`, setup chamada na função `/bot-parse` | 1.5h | ⬜ |
| 2.6 | Testar pipeline: Tg → IA → JSON | Enviar "Gastei 50 no Uber" e validar JSON | 1.5h | ⬜ |
| 2.7 | Adicionar validação de JSON | Função para verificar se resposta IA é JSON válido | 1h | ⬜ |
| 2.8 | Implementar try-catch/logging | Tratar erros, logar eventos no console | 1h | ⬜ |
| 2.9 | Criar resposta de confirmação | Bot responde com emoji ✅ e resumo extraído | 1h | ⬜ |
| 2.10 | Testar 5+ mensagens reais | Validar extração de múltiplas transações | 1h | ⬜ |

**Resultado entregável:** Bot que lê mensagens Telegram → Envia à IA → Retorna JSON estruturado

**JSON esperado:**
```json
{
  "valor": 150,
  "data": "2025-01-15",
  "categoria": "Alimentação",
  "metodo_pagamento": "CREDIT",
  "parcelas": 3,
  "descricao": "Restaurante"
}
```

**Checklist de validação:**
- [ ] Bot responde com confirmação no Telegram
- [ ] JSON extraído valida contra schema
- [ ] Erros de API são tratados gracefully
- [ ] Logs aparecem no console (sem exposição de dados sensíveis)

---

## 🗄️ SPRINT 3: Banco de Dados & Persistência (Semana 3)
**Objetivo:** Criar tabelas no Supabase e salvar transações  
**Dependências:** Sprint 1 ✅, Sprint 2 ✅  
**Duração:** 1 semana

### Tarefas

| # | Tarefa | Subtarefa | Tempo | Status |
|---|--------|-----------|-------|--------|
| 3.1 | Criar tabela `users` no Supabase | UUID PK, google_id (unique), email, telegram_chat_id | 1h | ⬜ |
| 3.2 | Criar tabela `transactions` | UUID, user_id FK, amount, description, category, payment_method, installments, date | 1.5h | ⬜ |
| 3.3 | Criar tabela `budgets` | UUID, user_id FK, category, monthly_limit | 1h | ⬜ |
| 3.4 | Instalar Supabase client | `npm install @supabase/supabase-js` | 30m | ⬜ |
| 3.5 | Criar arquivo config Supabase | `/backend/src/db.js` com inicialização client | 1h | ⬜ |
| 3.6 | Criar função salvar transação | `saveTransaction(userId, transactionData)` | 1.5h | ⬜ |
| 3.7 | Criar função buscar transações | `getUserTransactions(userId, filters)` | 1h | ⬜ |
| 3.8 | Criar função atualizar/deletar | `updateTransaction()`, `deleteTransaction()` | 1h | ⬜ |
| 3.9 | Conectar bot ao BD | Fluxo: IA → validação → `saveTransaction()` | 1.5h | ⬜ |
| 3.10 | Testar E2E: Telegram → BD | Enviar mensagem e validar registro no Supabase | 1.5h | ⬜ |
| 3.11 | Criar índices para performance | Index em `user_id`, `date`, `category` | 1h | ⬜ |
| 3.12 | Setup backups automáticos | Configurar Supabase para daily backups | 30m | ⬜ |

**Resultado entregável:** BD persistindo transações, fluxo completo Telegram → Supabase

**Checklist de validação:**
- [ ] Tabelas criadas e acessíveis
- [ ] Transação salva no BD após enviar no Telegram
- [ ] Query busca transações filtradas corretamente
- [ ] Sem erros de constraint ou tipo de dado

---

## 🎨 SPRINT 4: Frontend Base & Dark Mode (Semana 4)
**Objetivo:** Estrutura do Next.js, layout principal, tema escuro  
**Dependências:** Sprint 1 ✅  
**Duração:** 1 semana

### Tarefas

| # | Tarefa | Subtarefa | Tempo | Status |
|---|--------|-----------|-------|--------|
| 4.1 | Configurar Tailwind + Dark Mode | Modo escuro habilitado, cores roxo primário | 1h | ⬜ |
| 4.2 | Setup shadcn/ui | Instalar componentes base (Button, Card, Input) | 1h | ⬜ |
| 4.3 | Criar layout raiz | `/app/layout.tsx` com navbar, sidebar, footer | 2h | ⬜ |
| 4.4 | Criar página home | Placeholder `/app/page.tsx` | 30m | ⬜ |
| 4.5 | Criar navbar com navegação | Links: Home, Transações, Categorias, Investimentos, Assinaturas | 1.5h | ⬜ |
| 4.6 | Criar sidebar com menu mobile-responsive | Collapsa em mobile (<768px) | 1.5h | ⬜ |
| 4.7 | Definir paleta de cores | CSS vars para roxo (#7F77DD primário), tons de cinza | 1h | ⬜ |
| 4.8 | Criar componente Card genérico | Reutilizável para dashboard | 1h | ⬜ |
| 4.9 | Criar componente Badge/Tag | Para categorias, status | 1h | ⬜ |
| 4.10 | Implementar responsividade | Testes em mobile (375px), tablet (768px), desktop (1920px) | 1.5h | ⬜ |
| 4.11 | Adicionar tema toggle | Botão para alternar light/dark mode | 1h | ⬜ |
| 4.12 | Documentar componentes usados | README de padrões de UI/UX | 30m | ⬜ |

**Resultado entregável:** Frontend estruturado, tema escuro roxo funcionando, responsivo

**Checklist de validação:**
- [ ] Navbar navegável em todos os breakpoints
- [ ] Tema escuro aplicado globalmente (roxo/cinza)
- [ ] Sem layout shift ao trocar tema
- [ ] Componentes básicos reutilizáveis criados

---

## 🔐 SPRINT 5: Autenticação Firebase (Semana 5)
**Objetivo:** Login com Google, sessão do usuário, integração com BD  
**Dependências:** Sprint 3 ✅, Sprint 4 ✅  
**Duração:** 1 semana

### Tarefas

| # | Tarefa | Subtarefa | Tempo | Status |
|---|--------|-----------|-------|--------|
| 5.1 | Setup Firebase projeto | Console: criar app, copiar config em `.env.local` | 1h | ⬜ |
| 5.2 | Instalar Firebase SDK | `npm install firebase` | 30m | ⬜ |
| 5.3 | Ativar Google OAuth | Firebase console: Métodos de login | 30m | ⬜ |
| 5.4 | Criar arquivo auth config | `/lib/firebase.js` com inicialização | 1h | ⬜ |
| 5.5 | Criar página de login | `/app/login/page.tsx` com botão "Entrar com Google" | 1.5h | ⬜ |
| 5.6 | Implementar fluxo OAuth | Redirects após login bem-sucedido | 1.5h | ⬜ |
| 5.7 | Criar contexto de autenticação | `/lib/AuthContext.tsx`, useAuth hook | 1.5h | ⬜ |
| 5.8 | Sincronizar Firebase → Supabase | Ao primeiro login, criar user no BD | 1.5h | ⬜ |
| 5.9 | Criar middleware de proteção | Rotas privadas checam autenticação | 1.5h | ⬜ |
| 5.10 | Implementar logout | Botão de logout limpa sessão | 1h | ⬜ |
| 5.11 | Testar fluxo completo | Login → Redirect → User criado BD → Acesso dashboard | 1.5h | ⬜ |
| 5.12 | Adicionar tratamento de erros | Error boundary para falhas de auth | 1h | ⬜ |

**Resultado entregável:** Autenticação Google funcional, usuários sincronizados com BD

**Checklist de validação:**
- [ ] Botão Google OAuth funciona
- [ ] Novo usuário criado automaticamente no Supabase
- [ ] Sessão mantém ao recarregar página
- [ ] Logout remove sessão
- [ ] Rotas protegidas redirecionam não-autenticados

---

## 📈 SPRINT 6: Gráficos & Dashboard Principal (Semana 6)
**Objetivo:** Visualizar transações em gráficos, dashboard com KPIs  
**Dependências:** Sprint 3 ✅, Sprint 4 ✅, Sprint 5 ✅  
**Duração:** 1 semana

### Tarefas

| # | Tarefa | Subtarefa | Tempo | Status |
|---|--------|-----------|-------|--------|
| 6.1 | Criar API `/api/transactions` | GET transações por filtro (user_id, date range, category) | 1.5h | ⬜ |
| 6.2 | Criar API `/api/summary` | Retorna: total mês, fatura cartão, custos fixos | 1h | ⬜ |
| 6.3 | Instalar Recharts | `npm install recharts` | 30m | ⬜ |
| 6.4 | Criar componente KPI Cards | Cards: "Total Gasto", "Fatura Crédito", "Custos Fixos" | 1.5h | ⬜ |
| 6.5 | Criar gráfico de pizza (composição) | Recharts PieChart: distribuição por categoria | 1.5h | ⬜ |
| 6.6 | Criar gráfico de linhas (tendências) | LineChart: gastos últimos 6 meses | 1.5h | ⬜ |
| 6.7 | Criar gráfico de barras (projeção) | BarChart: projeção faturas parcelas próximas | 1.5h | ⬜ |
| 6.8 | Implementar loading states | Skeleton loaders enquanto carrega dados | 1h | ⬜ |
| 6.9 | Implementar filtros de data | DatePicker para selecionar período | 1h | ⬜ |
| 6.10 | Integrar com Supabase queries | Gráficos puxam dados reais do BD | 1.5h | ⬜ |
| 6.11 | Testar responsividade dos gráficos | Validar em mobile/tablet | 1h | ⬜ |
| 6.12 | Otimizar performance de renderização | Memoization, lazy loading | 1h | ⬜ |

**Resultado entregável:** Dashboard completo com 3 gráficos + KPI cards funcionando

**Checklist de validação:**
- [ ] Dashboard carrega dados do usuário autenticado
- [ ] Gráficos renderizam sem erros
- [ ] Filtros de data atualizam visualizações
- [ ] Performance aceitável (<2s load)

---

## 🎯 SPRINT 7: Módulo de Categorias & Orçamentos (Semana 7)
**Objetivo:** Gerenciar categorias, definir orçamentos, alertas  
**Dependências:** Sprint 3 ✅, Sprint 5 ✅, Sprint 6 ✅  
**Duração:** 1 semana

### Tarefas

| # | Tarefa | Subtarefa | Tempo | Status |
|---|--------|-----------|-------|--------|
| 7.1 | Criar API `/api/budgets` CRUD | POST, GET, PUT, DELETE orçamentos | 1.5h | ⬜ |
| 7.2 | Criar página `/dashboard/categories` | Lista de categorias com orçamentos | 1.5h | ⬜ |
| 7.3 | Criar modal/form de novo orçamento | Input: categoria, limite mensal | 1h | ⬜ |
| 7.4 | Implementar progress bar | Visual de consumo vs. limite | 1h | ⬜ |
| 7.5 | Lógica de alerta 80% | Backend: função que detecta threshold | 1h | ⬜ |
| 7.6 | Integrar alertas no bot | Telegram envia mensagem ao atingir 80% | 1.5h | ⬜ |
| 7.7 | Criar tabela de categorias editáveis | Permitir rename, delete de categorias | 1h | ⬜ |
| 7.8 | Testar fluxo de alerta | Gastar até 80% → Receber mensagem Telegram | 1h | ⬜ |
| 7.9 | Adicionar default budgets | Sugerir categorias padrão ao usuário novo | 1h | ⬜ |
| 7.10 | Validações de orçamento | Valores positivos, categorias únicas por user | 1h | ⬜ |

**Resultado entregável:** Sistema de orçamentos com alertas no Telegram

**Checklist de validação:**
- [ ] Novo orçamento salva no BD
- [ ] Progress bar atualiza com gasto
- [ ] Alerta enviado ao atingir 80%
- [ ] Édição/exclusão de orçamentos funciona

---

## 💪 SPRINT 8: Módulo de Investimento Pessoal (Semana 8)
**Objetivo:** Dashboard dedicado saúde/fitness com categorização especial  
**Dependências:** Sprint 6 ✅, Sprint 7 ✅  
**Duração:** 1 semana

### Tarefas

| # | Tarefa | Subtarefa | Tempo | Status |
|---|--------|-----------|-------|--------|
| 8.1 | Criar categorias sub-tipo | Enum: Academia, Natação, Suplementação, Alimentação Saudável, Equipamentos | 1h | ⬜ |
| 8.2 | Criar página `/dashboard/investimento-pessoal` | Dashboard dedicado | 1.5h | ⬜ |
| 8.3 | Gráfico pizza: breakdown subcategorias | Recharts mostrando % gastos | 1.5h | ⬜ |
| 8.4 | Gráfico linha: tendência trimestral | Monitorar evolução de investimento | 1.5h | ⬜ |
| 8.5 | Tabela de transações filtrada | Mostrar últimas 20 transações saúde | 1h | ⬜ |
| 8.6 | Card de "ROI" fitness | Cálculo simples: % gasto vs. mês anterior (sinal de engajamento) | 1h | ⬜ |
| 8.7 | Adicionar tags personalizadas | Ex: "Maratona", "Emagrecimento", "Força" | 1h | ⬜ |
| 8.8 | Implementar "Metas" | Usuário define meta de gastos/mês em saúde | 1h | ⬜ |
| 8.9 | Testar com dados realistas | Simular 3+ meses de gasto saúde | 1h | ⬜ |

**Resultado entregável:** Dashboard de fitness funcional com métricas customizadas

**Checklist de validação:**
- [ ] Transações saúde filtradas corretamente
- [ ] Gráficos mostram dados da subcategoria
- [ ] Metas salvam e validam
- [ ] UI visualmente distinta do dashboard principal

---

## 🔔 SPRINT 9: Módulo de Assinaturas & Detecção (Semana 9)
**Objetivo:** Detectar cobranças recorrentes, listar assinaturas  
**Dependências:** Sprint 3 ✅, Sprint 6 ✅  
**Duração:** 1 semana

### Tarefas

| # | Tarefa | Subtarefa | Tempo | Status |
|---|--------|-----------|-------|--------|
| 9.1 | Criar tabela `subscriptions` | UUID, user_id, name, amount, frequency (mensal/anual), date_start | 1h | ⬜ |
| 9.2 | Algoritmo de detecção automática | Backend: detecta transações recorrentes (mesmo valor/date) | 1.5h | ⬜ |
| 9.3 | Criar página `/dashboard/assinaturas` | Tabela de assinaturas com status | 1h | ⬜ |
| 9.4 | Implementar manual add subscription | Form para adicionar assinatura manualmente | 1h | ⬜ |
| 9.5 | Mostrar próxima cobrança | Data da próxima charge estimada | 1h | ⬜ |
| 9.6 | Calcular total de assinaturas/mês | Card mostrando total de custos fixos | 1h | ⬜ |
| 9.7 | Adicionar toggle ativo/inativo | Usuário marca assinatura como pausada | 1h | ⬜ |
| 9.8 | Criar alerta de cancelamento | Opcionalmente, lembrar para cancelar assinaturas | 1h | ⬜ |
| 9.9 | Testar detecção com dados reais | Importar transações e validar que assinaturas foram detectadas | 1h | ⬜ |

**Resultado entregável:** Sistema de assinaturas com detecção automática

**Checklist de validação:**
- [ ] Assinatura nova salva no BD
- [ ] Próxima cobrança calculada corretamente
- [ ] Algoritmo detecta recorrências
- [ ] Total/mês atualiza quando add/remove assinatura

---

## 🚀 SPRINT 10: Integração Final & Polishing (Semana 10)
**Objetivo:** Testar E2E, performance, segurança, deployment prep  
**Dependências:** Sprints 1-9 ✅  
**Duração:** 1 semana

### Tarefas

| # | Tarefa | Subtarefa | Tempo | Status |
|---|--------|-----------|-------|--------|
| 10.1 | Testar fluxo completo E2E | Telegram → BD → Dashboard (múltiplos usuários) | 2h | ⬜ |
| 10.2 | Validar segurança | CORS correto, rate limiting, validação de inputs | 1.5h | ⬜ |
| 10.3 | Otimizar queries banco | Índices, lazy loading, pagination | 1.5h | ⬜ |
| 10.4 | Performance frontend | Lighthouse score >80, bundle size <500kb | 1.5h | ⬜ |
| 10.5 | Testar em múltiplos browsers | Chrome, Firefox, Safari, Mobile | 1.5h | ⬜ |
| 10.6 | Adicionar error boundaries | Tratamento de erros UI em todas páginas | 1h | ⬜ |
| 10.7 | Documentar APIs | OpenAPI/Swagger schema dos endpoints | 1h | ⬜ |
| 10.8 | Criar guia de deployment | Instrções para Vercel (frontend), Heroku/Railway (backend) | 1h | ⬜ |
| 10.9 | Setup CI/CD básico | GitHub Actions: lint + tests | 1.5h | ⬜ |
| 10.10 | Criar dados de seed para testes | Scripts para popular BD com dados realistas | 1h | ⬜ |

**Resultado entregável:** Sistema pronto para MVP público, documentado, testado

**Checklist de validação:**
- [ ] Sem erros no console (frontend/backend)
- [ ] Todas as features funcionam sem dependência manual
- [ ] Performance aceitável
- [ ] Pode fazer deploy sem manual steps

---

## 📅 SPRINT 11: Features Expandidas & UX (Semana 11)
**Objetivo:** Polish, features nice-to-have, melhor UX  
**Dependências:** Sprint 10 ✅  
**Duração:** 1 semana (opcional)

### Tarefas

| # | Tarefa | Subtarefa | Tempo | Status |
|---|--------|-----------|-------|--------|
| 11.1 | Exportar dados | Botão para baixar transações em CSV/PDF | 1.5h | ⬜ |
| 11.2 | Comparação mês anterior | Cards mostrando % de variação vs. mês passado | 1.5h | ⬜ |
| 11.3 | Criar relatórios mensais | Gerar PDF com resumo gastos/categoria | 2h | ⬜ |
| 11.4 | Adicionar metas mensais | Setar meta geral e acompanhar % atingido | 1.5h | ⬜ |
| 11.5 | Sugestões de economia | IA recomenda cortes baseado em padrões | 1.5h | ⬜ |
| 11.6 | Dashboard mobile melhorado | Versão mobile com cards touch-optimized | 1.5h | ⬜ |
| 11.7 | Integração com múltiplos cartões | Suportar múltiplas contas de crédito | 2h | ⬜ |
| 11.8 | Notificações web push | Alertas de categoria no navegador | 1.5h | ⬜ |

**Resultado entregável:** Sistema mais rico e amigável, com features avançadas opcionais

---

## 📅 SPRINT 12: Maintenance & Monitoring (Semana 12)
**Objetivo:** Setup de logs, monitoring, analytics, suporte  
**Dependências:** Sprint 11 ✅  
**Duração:** 1 semana (ongoing)

### Tarefas

| # | Tarefa | Subtarefa | Tempo | Status |
|---|--------|-----------|-------|--------|
| 12.1 | Setup Sentry para logging | Rastrear erros em produção | 1h | ⬜ |
| 12.2 | Implementar analytics | Google Analytics ou Plausible | 1h | ⬜ |
| 12.3 | Criar dashboard de performance | Monitorar uptime, latência, erros | 1.5h | ⬜ |
| 12.4 | Documentação de troubleshooting | FAQ, common issues | 1h | ⬜ |
| 12.5 | Criar rotina de backup BD | Validar backups automáticos Supabase | 1h | ⬜ |
| 12.6 | Implementar feature flags | Para A/B testing de novas features | 1.5h | ⬜ |
| 12.7 | Feedback form no app | Permitir usuários reportar bugs | 1h | ⬜ |
| 12.8 | Roadmap público | Comunicar planos futuros aos usuários | 1h | ⬜ |

**Resultado entregável:** Sistema monitorado, com pipeline de feedback e manutenção

---

## 🎯 Milestones Críticos

| Milestone | Sprint | Descrição |
|-----------|--------|-----------|
| **MVP Funcional** | Sprint 3 ✅ | Bot → BD → Transações salvando |
| **Alpha Internal** | Sprint 5 ✅ | Autenticação + Dashboard básico |
| **Beta Público** | Sprint 7 ✅ | Orçamentos, alertas, UX polida |
| **Feature Complete** | Sprint 9 ✅ | Assinaturas, investimento pessoal |
| **Production Ready** | Sprint 10 ✅ | Testado, documentado, deployável |
| **Expansion Phase** | Sprint 11+ | Features avançadas, analytics |

---

## 🔥 Dependências Entre Sprints

```
Sprint 1 (Setup)
    ↓
Sprint 2 (Bot) ──→ Sprint 3 (DB)
    ↓                  ↓
    └──→ Sprint 4 (Frontend) ──→ Sprint 5 (Auth)
                                     ↓
                                Sprint 6 (Gráficos)
                                     ↓
                        Sprint 7 (Categorias/Orçamentos)
                                     ↓
                        Sprint 8 (Investimento Pessoal)
                                     ↓
                        Sprint 9 (Assinaturas)
                                     ↓
                        Sprint 10 (Integração Final)
                                     ↓
                        Sprint 11 (Features Extras)
                                     ↓
                        Sprint 12 (Monitoring)
```

---

## 📊 Estimativas Totais

| Fase | Sprints | Dias | Horas |
|------|---------|------|-------|
| Infraestrutura | 1 | 5 | ~40h |
| Backend Core | 2-3 | 10 | ~70h |
| Frontend Core | 4-6 | 15 | ~100h |
| Features Principais | 7-9 | 15 | ~100h |
| Polish & Deploy | 10-12 | 15 | ~90h |
| **TOTAL** | **12** | **60 dias** | **~400h** |

**Em paralelo:** ~3 meses com 1 dev senior (40h/semana)

---

## 📝 Dicas de Execução

### ✅ Best Practices

1. **Commit diário:** Ao menos 1 commit por tarefa concluída
2. **Branch strategy:** Feature branches (`feature/bot-parser`), PR reviews
3. **Testing mentalidade:** Testar manualmente cada tarefa ANTES de mark "pronto"
4. **Documentação viva:** Atualizar README com progresso
5. **Feedback loop:** Testar com amigos no fim de cada sprint
6. **Debt tech:** Reservar tempo em each sprint para refatorações

### ⚠️ Riscos Comuns

| Risco | Mitigation |
|-------|-----------|
| IA (OpenAI) cara em dev | Usar `gpt-4o-mini`, batch requests, cachear respostas |
| Banco de dados lento | Índices cedo, queries otimizadas, caching Redis (futura) |
| Scope creep | Manter MVP focado, features extras em Sprint 11+ |
| Integração Firebase complexa | Testar autenticação PRIMEIRA coisa em Sprint 5 |
| Performance gráficos | Recharts efficient, lazy load dados, pagination |

---

## 🚀 Como Usar Este Documento

1. **Imprima ou deixe aberto** em outra aba durante desenvolvimento
2. **Marque tasks com checkbox** conforme completa
3. **Mude status** na tabela (⬜ → 🟦 em progresso → ✅ completo)
4. **Ao fim de cada sprint:** Revise, documente learnings, repasse para próximo
5. **Se atrasar:** Priorize tarefas críticas (com ⭐), defer nice-to-have

Boa sorte! 🚀

---

*Documento criado em: Janeiro 2025*  
*Stack: Next.js + Node.js + Supabase + Firebase + OpenAI*
