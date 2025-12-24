const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supabase = require('../config/db');

// @route   POST /api/expenses
// @desc    Add a new expense
router.post('/', auth, async (req, res) => {
  try {
    const { title, amount, category, description } = req.body;

    const { data, error } = await supabase
      .from('expenses')
      .insert([
        {
          user_id: req.user.userId,
          amount: amount,
          category: category,
          payment_method: 'Manual', // Assuming manual for now
          description: title + (description ? ' - ' + description : ''),
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(201).json(data[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/expenses
// @desc    Get all expenses for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', req.user.userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.userId);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    if (data.length === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;