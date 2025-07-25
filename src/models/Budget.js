const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  month: { type: String, required: true }, // e.g., "2025-07"
  amount: { type: Number, required: true }
});

// ✅ Prevents OverwriteModelError
module.exports = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);
