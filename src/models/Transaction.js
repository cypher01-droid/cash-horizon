// src/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense', 'transfer'], required: true },
  amount: { type: Number, required: true },
  category: String,
  description: String,
  date: { type: Date, default: Date.now },
});

// ✅ THIS LINE PREVENTS DUPLICATE MODEL COMPILATION
module.exports = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
