const express = require('express');
const {
  listProviders,
  connectBank,
  syncBank,
  listConnections,
  removeConnection,
  importTransactions,
} = require('../services/bankService');
const { parseStatement } = require('../services/statementImport');

const router = express.Router();

// Middleware para aceitar payloads maiores apenas na rota /import
const largePayload = express.json({ limit: '5mb' });

// Lista os providers disponíveis (demo, nubank, itau, bradesco)
router.get('/providers', (req, res) => {
  res.json({ data: listProviders() });
});

// Lista as conexões já feitas pelo usuário
router.get('/', async (req, res) => {
  try {
    const data = await listConnections(req.userId);
    res.json({ data });
  } catch (err) {
    console.error('Erro GET /banks:', err);
    res.status(500).json({ error: 'Erro ao buscar conexões' });
  }
});

// Conecta a um banco: importa transações e salva a conexão
router.post('/connect', async (req, res) => {
  try {
    const { provider, credentials } = req.body;
    if (!provider) return res.status(400).json({ error: 'provider é obrigatório' });
    const result = await connectBank(req.userId, provider, credentials || {});
    res.status(201).json(result);
  } catch (err) {
    console.error('Erro POST /banks/connect:', err);
    res.status(400).json({ error: err.message });
  }
});

// Importa um extrato OFX/CSV (conteúdo enviado como texto no body)
router.post('/import', largePayload, async (req, res) => {
  try {
    const { content, filename } = req.body;
    if (!content) return res.status(400).json({ error: 'content (texto do arquivo) é obrigatório' });
    const parsed = parseStatement(content, filename || '');
    if (!parsed.length) {
      return res.status(400).json({ error: 'Nenhuma transação reconhecida no arquivo (OFX ou CSV).' });
    }
    const result = await importTransactions(req.userId, parsed);
    res.status(201).json({ found: parsed.length, ...result });
  } catch (err) {
    console.error('Erro POST /banks/import:', err);
    res.status(400).json({ error: err.message });
  }
});

// Re-sincroniza uma conexão existente
router.post('/:id/sync', async (req, res) => {
  try {
    const result = await syncBank(req.userId, req.params.id);
    res.json(result);
  } catch (err) {
    console.error('Erro POST /banks/:id/sync:', err);
    res.status(400).json({ error: err.message });
  }
});

// Remove uma conexão
router.delete('/:id', async (req, res) => {
  try {
    const result = await removeConnection(req.userId, req.params.id);
    res.json(result);
  } catch (err) {
    console.error('Erro DELETE /banks/:id:', err);
    res.status(500).json({ error: 'Erro ao remover conexão' });
  }
});

module.exports = router;
