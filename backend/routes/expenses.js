const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');

// @route   POST /api/expenses
// @desc    Add a new expense
router.post('/', auth, async (req, res) => {
  try {
    const { title, amount, category, description } = req.body;

    const expense = new Expense({
      user: req.user.userId,
      title,
      amount,
      category,
      description
    });

    await expense.save();
    res.status(201).json(expense);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/expenses
// @desc    Get all expenses for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.userId })
      .sort({ date: -1 });
    
    res.json(expenses);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Make sure user owns the expense
    if (expense.user.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;