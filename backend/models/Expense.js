const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Other']
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('Expense', ExpenseSchema);