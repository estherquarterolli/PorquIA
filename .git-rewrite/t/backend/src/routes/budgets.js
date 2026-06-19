const express = require('express');
const supabase = require('../config/supabase');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', req.userId)
      .order('category');

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    console.error('Erro GET /budgets:', err);
    res.status(500).json({ error: 'Erro ao buscar orçamentos' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { category, monthly_limit } = req.body;

    if (!category || !monthly_limit) {
      return res.status(400).json({ error: 'category e monthly_limit obrigatórios' });
    }

    const { data, error } = await supabase
      .from('budgets')
      .insert({ user_id: req.userId, category, monthly_limit })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) {
    console.error('Erro POST /budgets:', err);
    res.status(500).json({ error: 'Erro ao criar orçamento' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { monthly_limit } = req.body;

    if (!monthly_limit) {
      return res.status(400).json({ error: 'monthly_limit obrigatório' });
    }

    const { data, error } = await supabase
      .from('budgets')
      .update({ monthly_limit })
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Orçamento não encontrado' });
    }

    res.json({ data });
  } catch (err) {
    console.error('Erro PUT /budgets/:id:', err);
    res.status(500).json({ error: 'Erro ao atualizar orçamento' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Orçamento não encontrado' });
    }

    res.json({ data });
  } catch (err) {
    console.error('Erro DELETE /budgets/:id:', err);
    res.status(500).json({ error: 'Erro ao deletar orçamento' });
  }
});

module.exports = router;
