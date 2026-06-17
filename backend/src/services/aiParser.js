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
  "installments": número (quantidade de parcelas, padrão 1),
  "start_date": "string YYYY-MM do mês da 1ª parcela, ou null se não mencionado",
  "type": "string (despesa ou receita)"
}

REGRAS DE PARCELAMENTO (muito importante):
- "amount" é sempre o valor de UMA parcela (o que será cobrado POR MÊS).
- Quando o texto for "Nx VALOR" (ex: "12x 405,89"), VALOR já é o valor de cada parcela → amount = VALOR, installments = N.
- Quando for "VALOR em Nx" / "VALOR parcelado em N" (ex: "300 em 3x"), VALOR é o total → amount = VALOR / N, installments = N.
- Se mencionar mês de início (ex: "começou em abril de 2026", "a partir de janeiro"), preencha start_date no formato YYYY-MM. Sem ano explícito, use ${CURRENT_YEAR}. Sem menção de início, start_date = null.
- Use vírgula decimal brasileira: "405,89" = 405.89.

Exemplos:
- "gastei 50 no mercado" → {"amount": 50, "description": "mercado", "category": "alimentação", "payment_method": "outro", "installments": 1, "start_date": null, "type": "despesa"}
- "paguei 1200 de aluguel no pix" → {"amount": 1200, "description": "aluguel", "category": "moradia", "payment_method": "pix", "installments": 1, "start_date": null, "type": "despesa"}
- "celular 12x 405,89 nubank começou em abril de 2026" → {"amount": 405.89, "description": "celular", "category": "outros", "payment_method": "cartão_crédito", "installments": 12, "start_date": "2026-04", "type": "despesa"}
- "comprei tênis por 300 em 3x no cartão" → {"amount": 100, "description": "tênis", "category": "vestuário", "payment_method": "cartão_crédito", "installments": 3, "start_date": null, "type": "despesa"}
- "recebi salário 5000" → {"amount": 5000, "description": "salário", "category": "outros", "payment_method": "transferência", "installments": 1, "start_date": null, "type": "receita"}

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

  return JSON.parse(response.choices[0].message.content);
}

module.exports = { parseTransaction };
