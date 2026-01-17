const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/db'); 


router.get('/monthly', auth, async (req, res) => {
  const userId = req.user.id;

  const year = req.query.year
    ? parseInt(req.query.year)
    : new Date().getFullYear();

  try {
    const result = await db.query(
      `
      SELECT 
        DATE_TRUNC('month', expense_date) AS month,
        SUM(amount) AS total
      FROM expenses
      WHERE user_id = $1
        AND EXTRACT(YEAR FROM expense_date) = $2
      GROUP BY month
      ORDER BY month;
      `,
      [userId, year]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch monthly stats' });
  }
});

router.get('/by-category', auth, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      `
      SELECT 
        et.name AS category,
        SUM(e.amount) AS total
      FROM expenses e
      JOIN expense_types et ON e.expense_type_id = et.id
      WHERE e.user_id = $1
      GROUP BY et.name
      ORDER BY total DESC;
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch category stats' });
  }
});

router.get('/daily-average', auth, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      `
      SELECT 
        COALESCE(AVG(daily_total), 0) AS daily_average
      FROM (
        SELECT expense_date, SUM(amount) AS daily_total
        FROM expenses
        WHERE user_id = $1
        GROUP BY expense_date
      ) t;
      `,
      [userId]
    );

    res.json({
      daily_average: Number(result.rows[0].daily_average)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch daily average' });
  }
});


module.exports = router;
