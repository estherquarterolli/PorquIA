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

const SYSTEM_PROMPT = `Você é um parser financeiro. Analise mensagens em português e extraia dados de transações financeiras.

Retorne SEMPRE um JSON válido com esta estrutura:
{
  "amount": número (obrigatório, valor em reais, positivo),
  "description": "string (descrição curta da transação)",
  "category": "string (uma de: alimentação, transporte, moradia, saúde, lazer, educação, vestuário, serviços, investimento, outros)",
  "payment_method": "string (uma de: pix, cartão_crédito, cartão_débito, dinheiro, transferência, outro)",
  "installments": número (parcelas, padrão 1),
  "type": "string (despesa ou receita)"
}

Exemplos:
- "gastei 50 no mercado" → {"amount": 50, "description": "mercado", "category": "alimentação", "payment_method": "outro", "installments": 1, "type": "despesa"}
- "paguei 1200 de aluguel no pix" → {"amount": 1200, "description": "aluguel", "category": "moradia", "payment_method": "pix", "installments": 1, "type": "despesa"}
- "comprei tênis por 300 em 3x no cartão" → {"amount": 300, "description": "tênis", "category": "vestuário", "payment_method": "cartão_crédito", "installments": 3, "type": "despesa"}
- "recebi salário 5000" → {"amount": 5000, "description": "salário", "category": "outros", "payment_method": "transferência", "installments": 1, "type": "receita"}

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
