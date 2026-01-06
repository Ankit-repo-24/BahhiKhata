const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/db');

// ADD EXPENSE
router.post('/', auth, async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    const result = await db.query(
      `INSERT INTO expenses (user_id, title, amount, category, date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.userId, title, amount, category, date]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET ALL EXPENSES
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM expenses
       WHERE user_id = $1
       ORDER BY date DESC`,
      [req.user.userId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE EXPENSE
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await db.query(
      `DELETE FROM expenses
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [req.params.id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
