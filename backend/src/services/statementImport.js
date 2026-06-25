/**
 * statementImport — parser de extratos OFX e CSV (puro JS, sem dependências).
 * Converte o conteúdo de um arquivo em transações normalizadas:
 *   { date: ISO, description, amount (>0), type: 'despesa'|'receita', payment_method }
 */

// ── OFX ─────────────────────────────────────────────────────────────
// Extrai blocos <STMTTRN>...</STMTTRN>. OFX é SGML-like; valores negativos
// = débito (despesa), positivos = crédito (receita).
function parseOFXDate(raw) {
  if (!raw) return new Date().toISOString();
  // Formatos: 20240115, 20240115120000, 20240115120000[-3:BRT]
  const m = raw.match(/^(\d{4})(\d{2})(\d{2})(\d{2})?(\d{2})?(\d{2})?/);
  if (!m) return new Date().toISOString();
  const [, y, mo, d, h = '12', mi = '00', s = '00'] = m;
  return new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s)).toISOString();
}

function tag(block, name) {
  // Pega <NAME>valor (até quebra de linha ou próxima tag)
  const re = new RegExp(`<${name}>([^<\\r\\n]*)`, 'i');
  const m = block.match(re);
  return m ? m[1].trim() : '';
}

function parseOFX(text) {
  const blocks = text.match(/<STMTTRN>[\s\S]*?<\/STMTTRN>/gi) || [];
  const transactions = [];
  for (const block of blocks) {
    const amountRaw = tag(block, 'TRNAMT').replace(',', '.');
    const amount = parseFloat(amountRaw);
    if (isNaN(amount) || amount === 0) continue;
    const description = tag(block, 'MEMO') || tag(block, 'NAME') || 'Lançamento';
    transactions.push({
      date: parseOFXDate(tag(block, 'DTPOSTED')),
      description,
      amount: Math.abs(amount),
      type: amount < 0 ? 'despesa' : 'receita',
      payment_method: 'importado',
    });
  }
  return transactions;
}

// ── CSV ─────────────────────────────────────────────────────────────
function detectDelimiter(line) {
  const semi = (line.match(/;/g) || []).length;
  const comma = (line.match(/,/g) || []).length;
  return semi > comma ? ';' : ',';
}

function splitCSVLine(line, delim) {
  // Respeita aspas duplas
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === delim && !inQuotes) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim().replace(/^"|"$/g, ''));
}

function parseCSVDate(raw) {
  if (!raw) return new Date().toISOString();
  let m = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})/); // DD/MM/YYYY
  if (m) return new Date(Date.UTC(+m[3], +m[2] - 1, +m[1], 12)).toISOString();
  m = raw.match(/^(\d{4})-(\d{2})-(\d{2})/); // YYYY-MM-DD
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12)).toISOString();
  const d = new Date(raw);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function parseAmount(raw) {
  if (!raw) return NaN;
  // Remove R$, espaços; trata 1.234,56 (pt-BR) e 1,234.56 (en)
  let s = raw.replace(/[R$\s]/g, '');
  if (/,\d{2}$/.test(s)) {
    s = s.replace(/\./g, '').replace(',', '.'); // pt-BR
  } else {
    s = s.replace(/,/g, ''); // milhares en
  }
  return parseFloat(s);
}

function findColumn(headers, candidates) {
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i].toLowerCase();
    if (candidates.some((c) => h.includes(c))) return i;
  }
  return -1;
}

// Determina se um texto indica débito (despesa) ou crédito (receita)
function classifyTypeFromText(raw) {
  if (!raw) return null;
  const s = raw.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  if (/deb[ií]to|debito|saida|saída|pagamento|compra|saque|transfer[eê]ncia enviada|ted enviado|doc enviado/.test(s)) return 'despesa';
  if (/cr[eé]dito|credito|entrada|recebimento|depósito|deposito|pix recebido|ted recebido/.test(s)) return 'receita';
  return null;
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const delim = detectDelimiter(lines[0]);
  const headers = splitCSVLine(lines[0], delim);

  const iDate = findColumn(headers, ['data', 'date']);
  const iDesc = findColumn(headers, ['descri', 'histór', 'histor', 'description', 'memo', 'lançamento', 'lancamento', 'estabelecimento']);
  const iAmount = findColumn(headers, ['valor', 'amount', 'value']);

  // Colunas separadas de débito e crédito (ex: Nubank, Inter, Bradesco)
  const iDebit = findColumn(headers, ['débito', 'debito', 'saída', 'saida', 'debit']);
  const iCredit = findColumn(headers, ['crédito', 'credito', 'entrada', 'credit']);

  // Coluna de tipo/natureza (ex: "Tipo", "Natureza", "Tipo Lançamento")
  const iType = findColumn(headers, ['tipo', 'natureza', 'modalidade', 'tipo lançamento', 'tipo lancamento']);

  // Sem cabeçalho reconhecível → assume [data, descrição, valor]
  const cDate = iDate >= 0 ? iDate : 0;
  const cDesc = iDesc >= 0 ? iDesc : 1;
  const cAmount = iAmount >= 0 ? iAmount : 2;

  const transactions = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCSVLine(lines[i], delim);

    let amount = NaN;
    let type = null;

    // Formato com colunas separadas débito/crédito
    if (iDebit >= 0 && iCredit >= 0) {
      const debit = parseAmount(cols[iDebit] || '');
      const credit = parseAmount(cols[iCredit] || '');
      if (!isNaN(debit) && debit > 0) { amount = debit; type = 'despesa'; }
      else if (!isNaN(credit) && credit > 0) { amount = credit; type = 'receita'; }
    } else {
      amount = parseAmount(cols[cAmount] || '');
    }

    if (isNaN(amount) || amount === 0) continue;

    // Determina tipo se ainda não definido
    if (!type) {
      if (amount < 0) {
        type = 'despesa';
      } else if (iType >= 0) {
        type = classifyTypeFromText(cols[iType]) || 'despesa';
      } else {
        // Tenta classificar pela descrição
        type = classifyTypeFromText(cols[cDesc >= 0 ? cDesc : 1]) || 'despesa';
      }
    }

    if (cols.length <= (iDebit >= 0 ? Math.max(iDebit, iCredit) : cAmount)) continue;

    transactions.push({
      date: parseCSVDate(cols[cDate]),
      description: cols[cDesc >= 0 ? cDesc : 1] || 'Lançamento',
      amount: Math.abs(amount),
      type,
      payment_method: 'importado',
    });
  }
  return transactions;
}

/** Detecta formato pelo conteúdo/nome e parseia. */
function parseStatement(content, filename = '') {
  const isOFX = /<OFX>|<STMTTRN>/i.test(content) || /\.ofx$/i.test(filename);
  return isOFX ? parseOFX(content) : parseCSV(content);
}

module.exports = { parseStatement, parseOFX, parseCSV };
