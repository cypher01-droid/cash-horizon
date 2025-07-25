const express = require('express');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const router = express.Router();

// Get transactions for a user
router.get('/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des transactions.' });
  }
});

// Add a new transaction
router.post('/', async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();
    res.status(201).json({ message: 'Transaction ajoutée avec succès.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l’ajout de la transaction.' });
  }
});

// Set monthly budget
router.post('/budget', async (req, res) => {
  const { userId, amount, month } = req.body;
  try {
    const existing = await Budget.findOne({ userId, month });
    if (existing) {
      existing.amount = amount;
      await existing.save();
    } else {
      await new Budget({ userId, amount, month }).save();
    }
    res.json({ message: 'Budget enregistré.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la sauvegarde du budget.' });
  }
});

// Get budget
router.get('/budget/:userId/:month', async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.params.userId, month: req.params.month });
    res.json(budget || {});
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération du budget.' });
  }
});

module.exports = router;
