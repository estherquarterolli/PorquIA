const OpenAI = require('openai');

// Suporta Groq (gratuito, API compatível com OpenAI) ou OpenAI.
// Se GROQ_API_KEY estiver definida, usa Groq; senão cai pro OpenAI.
const useGroq = !!process.env.GROQ_API_KEY;
const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;

const MODEL =
  process.env.AI_MODEL || (useGroq ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini');

// Cria o cliente sob demanda — evita derrubar o servidor na importação
// caso nenhuma chave esteja configurada.
let _client;
function getClient() {
  if (!_client) {
    _client = new OpenAI({
      apiKey,
      baseURL: useGroq ? 'https://api.groq.com/openai/v1' : undefined,
    });
  }
  return _client;
}

const CURRENT_YEAR = new Date().getFullYear();

const SYSTEM_PROMPT = `Você é um parser financeiro. Analise mensagens em português e extraia dados de transações financeiras.

Retorne SEMPRE um JSON válido com esta estrutura:
{
  "amount": número (obrigatório, valor de UMA parcela/cobrança por mês, positivo),
  "description": "string (descrição curta da transação)",
  "category": "string (uma de: alimentação, transporte, moradia, saúde, lazer, educação, vestuário, serviços, investimento, outros)",
  "payment_method": "string (uma de: pix, cartão_crédito, cartão_débito, dinheiro, transferência, outro)",
  "installments": número (quantidade TOTAL de parcelas, padrão 1),
  "current_installment": número (parcela atual, padrão 1),
  "start_date": "string YYYY-MM do mês da 1ª parcela, ou null se não mencionado",
  "type": "string (despesa ou receita)"
}

REGRAS DE PARCELAMENTO (muito importante):
- "amount" é sempre o valor de UMA parcela (o que será cobrado POR MÊS).
- Quando o texto for "Nx VALOR" (ex: "12x 405,89"), VALOR já é o valor de cada parcela → amount = VALOR, installments = N.
- Quando for "VALOR em Nx" / "VALOR parcelado em N" (ex: "300 em 3x"), VALOR é o total → amount = VALOR / N, installments = N.
- Quando mencionar parcela atual (ex: "8 de 12", "parcela 8/12", "estou na 8a parcela de 12"), extraia current_installment = 8, installments = 12. O sistema lançará essa parcela no mês atual e as restantes nos próximos meses.
- Se mencionar mês de início (ex: "começou em abril de 2026", "a partir de janeiro"), preencha start_date no formato YYYY-MM. Sem ano explícito, use ${CURRENT_YEAR}. Sem menção de início, start_date = null.
- Use vírgula decimal brasileira: "405,89" = 405.89.

Exemplos:
- "gastei 50 no mercado" → {"amount": 50, "description": "mercado", "category": "alimentação", "payment_method": "outro", "installments": 1, "current_installment": 1, "start_date": null, "type": "despesa"}
- "celular 12x 405,89 nubank começou em abril de 2026" → {"amount": 405.89, "description": "celular", "category": "outros", "payment_method": "cartão_crédito", "installments": 12, "current_installment": 1, "start_date": "2026-04", "type": "despesa"}
- "comprei tênis por 300 em 3x no cartão" → {"amount": 100, "description": "tênis", "category": "vestuário", "payment_method": "cartão_crédito", "installments": 3, "current_installment": 1, "start_date": null, "type": "despesa"}
- "8 de 12 curso coreano 72,08" → {"amount": 72.08, "description": "curso coreano", "category": "educação", "payment_method": "cartão_crédito", "installments": 12, "current_installment": 8, "start_date": null, "type": "despesa"}
- "recebi salário 5000" → {"amount": 5000, "description": "salário", "category": "outros", "payment_method": "transferência", "installments": 1, "current_installment": 1, "start_date": null, "type": "receita"}

Se não conseguir identificar uma transação financeira, retorne: {"error": "Não entendi a transação. Tente: 'gastei 50 no mercado' ou 'paguei 1200 de aluguel'"}`;

async function parseTransaction(message) {
  if (!apiKey) {
    throw new Error('Nenhuma chave de IA configurada (defina GROQ_API_KEY no servidor)');
  }

  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: message },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1,
  });

  const parsed = JSON.parse(response.choices[0].message.content);
  if (parsed.error) return parsed;
  return enrichInstallments(message, parsed);
}

const MONTHS = {
  janeiro: 1, fevereiro: 2, março: 3, marco: 3, abril: 4, maio: 5, junho: 6,
  julho: 7, agosto: 8, setembro: 9, outubro: 10, novembro: 11, dezembro: 12,
};

// Reforço determinístico: garante parcelas e mês inicial mesmo que a IA falhe.
function enrichInstallments(message, parsed) {
  const text = String(message).toLowerCase();

  // Parcela atual de total: "8 de 12", "8/12", "parcela 8 de 12"
  const mAtual = text.match(/\b(\d{1,3})\s*(?:de|\/)\s*(\d{1,3})\b/);
  if (mAtual) {
    const cur = parseInt(mAtual[1], 10);
    const tot = parseInt(mAtual[2], 10);
    if (cur >= 1 && tot >= 2 && cur <= tot) {
      parsed.current_installment = cur;
      parsed.installments = tot;
    }
  }

  // Nº de parcelas: "12x", "12 x", "em 12 vezes", "em 12 parcelas"
  if (!mAtual) {
    const mParcelas =
      text.match(/(\d{1,3})\s*x\b/) ||
      text.match(/em\s+(\d{1,3})\s*(?:vezes|parcelas)/);
    if (mParcelas) {
      const n = parseInt(mParcelas[1], 10);
      if (n >= 2 && n <= 360) parsed.installments = n;
    }
  }

  // Mês inicial: "começou em abril de 2026", "a partir de janeiro", "início em março"
  const mInicio = text.match(
    /(?:come[çc]ou|come[çc]ando|a partir|in[íi]cio|iniciou|partir)\s*(?:de\s+|em\s+)?(janeiro|fevereiro|mar[çc]o|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)(?:\s+de)?\s*(\d{4})?/
  );
  if (mInicio) {
    const mon = MONTHS[mInicio[1]] || MONTHS[mInicio[1].replace('ç', 'c')];
    const year = mInicio[2] ? parseInt(mInicio[2], 10) : new Date().getFullYear();
    if (mon) parsed.start_date = `${year}-${String(mon).padStart(2, '0')}`;
  }

  return parsed;
}

module.exports = { parseTransaction };
