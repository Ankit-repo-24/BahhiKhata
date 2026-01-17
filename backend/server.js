try {
  require('dotenv').config();
} catch (e) {
  // dotenv not needed in production
}
const express = require('express');
const cors = require('cors');

const db = require('./config/db'); 
const statsRoutes = require('./routes/stats');

const app = express();
const expenseTypesRoutes = require('./routes/expenseTypes');
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/expense-types', expenseTypesRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Bahhi-Khata API is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
