const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const supabase = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenses'));

// Test route
app.get('/', (req, res) => {
  res.send('Bahhi-Khata API is running with Supabase');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});