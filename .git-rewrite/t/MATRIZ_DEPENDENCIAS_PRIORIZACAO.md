# 🔗 Matriz de Dependências & Guia de Priorização

## Visão Rápida: O que precisa estar pronto antes de cada sprint?

```
Sprint 1 (Setup)
├─ 0 dependências externas
└─ TUDO pode começar hoje

Sprint 2 (Bot + IA)
├─ Depende: Sprint 1 ✅
├─ Requisita: Token Telegram + OpenAI API key
└─ Output: JSON estruturado do Telegram

Sprint 3 (Database)
├─ Depende: Sprint 1 ✅, Sprint 2 ✅
├─ Requisita: Supabase credenciais
└─ Bloqueador de: Sprint 5 (Auth)

Sprint 4 (Frontend Base)
├─ Depende: Sprint 1 ✅
├─ PARALELO com Sprint 2 e 3 ✅
└─ Bloqueador de: Sprint 5 (Auth)

Sprint 5 (Auth)
├─ Depende: Sprint 3 ✅, Sprint 4 ✅
├─ Requisita: Firebase project + Google OAuth
├─ Bloqueador de: Sprint 6, 7, 8, 9, 10
└─ CRÍTICO: Sem isso, nada funciona

Sprint 6 (Gráficos)
├─ Depende: Sprint 3, 4, 5 ✅
└─ Bloqueador de: Sprint 11 (Features)

Sprint 7 (Orçamentos + Alertas)
├─ Depende: Sprint 3, 4, 5, 6 ✅
├─ Requisita: Bot still running (Sprint 2)
└─ Bloqueador de: Sprint 8, 9

Sprint 8 (Investimento Pessoal)
├─ Depende: Sprint 6, 7 ✅
└─ Standalone (pode pular se necessário)

Sprint 9 (Assinaturas)
├─ Depende: Sprint 3, 4, 5, 6 ✅
├─ Opcional: Sprint 7 (mais integrado se tiver)
└─ Standalone (pode pular se necessário)

Sprint 10 (Integração Final)
├─ Depende: Sprint 1-9 (pelo menos 1-7)
└─ Bloqueador de: Launch

Sprint 11 (Features Expandidas)
├─ Depende: Sprint 10 ✅
├─ TOTALMENTE OPCIONAL
└─ Se sobrar tempo

Sprint 12 (Monitoring)
├─ Depende: Sprint 10 ✅
├─ ONGOING/PARALELO
└─ Começa antes do launch
```

---

## 🎯 Caminho Crítico (Critical Path Analysis)

### Se você TEM 12 semanas:
Siga o roadmap linear: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12

### Se você TEM 8 semanas:
1. Sprint 1 (Setup)
2. Sprint 2 (Bot) **PARALELO** Sprint 3 (DB) **PARALELO** Sprint 4 (Frontend)
3. Sprint 5 (Auth)
4. Sprint 6 (Gráficos)
5. Sprint 7 (Orçamentos)
6. Sprint 9 ou 10 (escolha: Assinaturas ou Integração Final)

**Skip:** Sprint 8 (Investimento Pessoal), Sprint 11, 12 → Adicionar depois

### Se você TEM 4 semanas (MVP mínimo):
1. Sprint 1 (Setup)
2. Sprint 2 + 3 + 4 (Bot, DB, Frontend) **SIMULTANEAMENTE**
3. Sprint 5 (Auth)
4. Sprint 6 (Gráficos) **OU** Sprint 7 (Orçamentos) - **escolha UM**

**Skip:** Sprints 8, 9, 11, 12

---

## 📊 Matriz de Bloqueios: O que libera o quê

| Sprint | Bloqueador? | Libera | Motivo |
|--------|-----------|--------|--------|
| 1 | NÃO | 2, 3, 4 | Setup é pré-requisito de tudo |
| 2 | NÃO | 3 (parcial) | Bot pode funcionar sozinho |
| 3 | **SIM** | 5, 7, 9 | Tabelas de usuário/transações são fundamentais |
| 4 | NÃO | 5 (parcial) | UI base pronta, mas auth precisa de DB |
| 5 | **SIM CRÍTICO** | 6, 7, 8, 9, 10 | Usuário logado é tudo |
| 6 | NÃO | 11 | Gráficos funcionam sozinhos |
| 7 | NÃO | 8, 9 | Features opcionais mas independentes |
| 8 | NÃO | 11 | Feature nice-to-have, isolada |
| 9 | NÃO | 11 | Feature nice-to-have, isolada |
| 10 | **SIM (integração)** | 12, launch | Teste final de tudo junto |
| 11 | NÃO | 12 | Features extras, não críticas |
| 12 | NÃO | - | Monitoring é ongoing |

---

## ⚠️ Riscos de Atraso: O que pode travar tudo

### Risco 1: Sprint 3 (Database) atrasa
**Impacto:** Sprints 5, 7, 9 não podem começar  
**Mitigation:** Começar Sprint 3 no segundo dia de Sprint 1, não esperar finalizar

### Risco 2: Sprint 5 (Auth) atrasa
**Impacto:** Sprints 6, 7, 8, 9, 10 viram ficção  
**Mitigation:** Começar testes de Firebase no Sprint 4, ter mock de usuário pronto

### Risco 3: API OpenAI cara / quotas altas
**Impacto:** Bot fica caro em produção  
**Mitigation:** 
- Usar `gpt-4o-mini` (mais barato que `gpt-4o`)
- Cache respostas da IA em `transactions` table
- Testar modo "off" para desenvolvimento

### Risco 4: Scope creep (features extra)
**Impacto:** Atrasam Sprints 7-9, push para 11+  
**Mitigation:** Manter disciplina, features novas SEMPRE em Sprint 11

---

## 🚀 Strategy Recomendada: Executar em Paralelo

Se quer **terminar em 10 semanas** ao invés de 12, execute assim:

```
Semana 1: Sprint 1 (Setup)
Semana 2: Sprint 2 (Bot) || Sprint 3 (DB) || Sprint 4 (Frontend)
Semana 3: Sprint 3 (DB continua) || Sprint 4 (Frontend continua)
Semana 4: Sprint 5 (Auth)
Semana 5: Sprint 6 (Gráficos)
Semana 6: Sprint 7 (Orçamentos)
Semana 7: Sprint 8 (Investimento Pessoal) || Sprint 9 (Assinaturas)
Semana 8: Sprint 9 (termina) || Sprint 10 (Integração)
Semana 9: Sprint 10 (Integração Final, testes E2E)
Semana 10: Sprint 11 (Features) || Launch
```

**Pré-requisito:** Você TEM que conseguir fazer 2-3 sprints em paralelo  
**Vantagem:** Ganha 2 semanas de buffer

---

## 📝 Checklist de Go/No-Go para cada Sprint

### Sprint 1 → 2 ✅
- [ ] `npm run dev` funciona frontend E backend
- [ ] `.env` e `.env.local` preenchidos
- [ ] Repos commitados e pushed
- **GO se:** Tudo acima ✅  
- **NO-GO se:** Faltar credenciais ou código não roda

### Sprint 2 → 3 ✅
- [ ] Bot recebe e responde mensagens no Telegram
- [ ] Parser IA retorna JSON válido
- [ ] 5+ testes manuais de parsing funcionaram
- **GO se:** Tudo acima ✅  
- **NO-GO se:** IA devolvendo output inválido ou bot não responde

### Sprint 3 → 4 (paralelo) ✅
- [ ] Tabelas criadas no Supabase
- [ ] Backend conecta ao BD
- [ ] Consegue INSERT/SELECT sem erro
- **GO se:** Tudo acima ✅  
- **NO-GO se:** Erro de conexão ou constraint violation

### Sprint 4 → 5 ✅
- [ ] Layout principal rodando
- [ ] Responsivo em mobile/tablet/desktop
- [ ] Dark mode ativo e funcionando
- **GO se:** Tudo acima ✅  
- **NO-GO se:** Quebrado em 1+ breakpoint

### Sprint 5 → 6 ✅
- [ ] Google OAuth funciona
- [ ] Novo usuário criado auto no BD
- [ ] Logout limpa sessão
- [ ] Rotas privadas protegidas
- **GO se:** Tudo acima ✅  
- **NO-GO se:** Login não funciona ou usuário não aparece no BD

### Sprint 6 → 7 ✅
- [ ] 3 gráficos renderizam com dados reais
- [ ] Filtros de data funcionam
- [ ] Loading states aparecem
- **GO se:** Tudo acima ✅  
- **NO-GO se:** Gráfico quebrado ou performance ruim (<2s)

### Sprint 7 → 8 ✅
- [ ] CRUD orçamentos funciona
- [ ] Alerta 80% dispara no Telegram
- [ ] Progress bar visual
- **GO se:** Tudo acima ✅  
- **NO-GO se:** Alerta não chega ou orçamento não salva

### Sprint 9 → 10 ✅
- [ ] Assinaturas detectadas automaticamente
- [ ] Tabela mostra listagem correta
- [ ] Próxima cobrança calculada
- **GO se:** Tudo acima ✅  
- **NO-GO se:** Detecção não funciona ou total errado

### Sprint 10 → Launch ✅
- [ ] E2E: Telegram → BD → Dashboard → Gráficos (sem intervenção)
- [ ] Sem erros console (frontend/backend)
- [ ] Performance Lighthouse >80
- [ ] Testado em Chrome, Firefox, Safari, Mobile
- **GO se:** TUDO acima + sem bugs críticos ✅  
- **NO-GO se:** Qualquer feature principal falha

---

## 🎓 Padrão: Se Fica Preso, Faça Isso

### Cenário: Supabase não conecta (Sprint 3)
**Tempo máximo:** 2 horas  
**Ação:**
1. Verificar `.env` (copy-paste exato? espaços?)
2. Testar com `curl` direto na Supabase
3. Se falhar: Usar SQLite local + portar depois
4. **Move on:** Não trave em 1 detalhe

### Cenário: OpenAI API cara (Sprint 2)
**Tempo máximo:** 1.5 horas  
**Ação:**
1. Usar `gpt-4o-mini` ao invés de `gpt-4o`
2. Cachear respostas no BD
3. Testar modo "mock" (hardcode JSON)
4. **Move on:** Otimizar custo depois

### Cenário: Firebase auth complicado (Sprint 5)
**Tempo máximo:** 3 horas  
**Ação:**
1. Seguir docs oficiais (não ChatGPT)
2. Testar em outro projeto dummy
3. Se > 3h, usar alternativa (Clerk, Auth0)
4. **Move on:** Refatorar depois

### Cenário: Gráfico Recharts não renderiza (Sprint 6)
**Tempo máximo:** 1.5 horas  
**Ação:**
1. Console.log dos dados (JSON válido?)
2. Testar com dados mock
3. Se > 1.5h, usar Chart.js ou canvas
4. **Move on:** Não perfeccionismo

---

## 📈 Métrica: Como Saber se Estou no Ritmo?

**Esperado por fim de cada sprint:**

| Sprint | Commits | LoC (+) | Funcionalidade |
|--------|---------|---------|-----------------|
| 1 | 5-10 | 500-700 | Setup completo |
| 2 | 10-15 | 800-1000 | Bot operacional |
| 3 | 8-12 | 400-600 | Queries BD |
| 4 | 15-20 | 1200-1500 | Dashboard UI |
| 5 | 10-15 | 600-800 | Auth sistema |
| 6 | 12-18 | 1500-2000 | Gráficos |
| 7 | 12-15 | 800-1000 | Orçamentos |
| 8 | 10-12 | 600-800 | Investimento |
| 9 | 10-12 | 700-900 | Assinaturas |
| 10 | 8-10 | 400-500 | Polishing |

**Se você está:**
- **ATRASADO** (commit count < esperado): Skip features nice-to-have, focus em MVP
- **ADIANTADO** (commit count > esperado): Ótimo! Adicione testes ou features
- **NO RITMO**: Continue assim!

---

## ✅ Final: Ordem de Execução Recomendada

### Semana 1
```
Day 1: Sprint 1 (Setup)
  └─ Terminar com tudo rodando locally
```

### Semana 2-3
```
Day 1-2: Sprint 2 (Bot) comece HOJE (paralelo Sprint 3)
Day 1-2: Sprint 3 (BD) comece HOJE (paralelo Sprint 2)
Day 1-2: Sprint 4 (Frontend) comece ao mesmo tempo
Day 3-5: Continue paralelizado
```

### Semana 4
```
Sprint 5 (Auth) - APENAS quando Sprints 3 e 4 estiverem ~80% prontos
```

### Semana 5-6
```
Sprint 6 (Gráficos) + Sprint 7 (Orçamentos) em sequência linear
```

### Semana 7-8
```
Sprint 8 e 9 podem ser PARALELAS ou sequenciais (ambas são features)
```

### Semana 9-10
```
Sprint 10 (Integração) + testes
Sprint 11 (Features extras) se tempo sobrar
```

---

## 🚀 Comece HOJE

```bash
# Abrir este arquivo
cat PLANO_SPRINTS_FINANCEIRO.md

# Seguir o Quick Start
cat QUICK_START_SPRINT_1.md

# Primeiro comando:
mkdir meu-rastreador-financeiro && cd meu-rastreador-financeiro
git init
# ... (segue Quick Start)
```

**Você CONSEGUE fazer isso em 10-12 semanas.** Disciplina > Perfeição.

---

*Documento criado em: Janeiro 2025*  
*Última atualização: [hoje]*
