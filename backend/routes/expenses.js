const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/db');

/**
 * Phase 3:
 * - Add expense with validation
 * - Use schema-correct fields
 */

// ADD EXPENSE
router.post('/', auth, async (req, res) => {
  try {
    const { amount, description, expense_date, expense_type_id } = req.body;

    // Basic validation
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const typeId = expense_type_id || 1; // default "General"

    const result = await db.query(
      `
      INSERT INTO expenses (
        user_id,
        amount,
        description,
        expense_date,
        expense_type_id
      )
      VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE), $5)
      RETURNING id, amount, description, expense_date, expense_type_id
      `,
      [
        req.user.userId,
        amount,
        description || null,
        expense_date || null,
        typeId
      ]
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
      `
      SELECT
        e.id,
        e.amount,
        e.description,
        e.expense_date,
        t.name AS expense_type
      FROM expenses e
      JOIN expense_types t ON e.expense_type_id = t.id
      WHERE e.user_id = $1
      ORDER BY e.expense_date DESC
      `,
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
      `
      DELETE FROM expenses
      WHERE id = $1 AND user_id = $2
      RETURNING id
      `,
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
