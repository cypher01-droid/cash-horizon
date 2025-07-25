const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Create Express app
const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://didier:Vh.N9uUaH-Gz8uz@cluster0.bdjd1af.mongodb.net/cashhorizon', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// File upload setup
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // Max 10MB
});

// User schema
const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  dob: String,
  password: String,
  address: String,
  nationality: String,
  securityAnswer: String,
  termsAccepted: Boolean,
  idUpload: String,
  balance: { type: Number, default: 0 }  // 💰 User balance

});

const transferSchema = new mongoose.Schema({
    senderId: String,
    receiverId: String,
    amount: Number,
    message: String,
    timestamp: { type: Date, default: Date.now }
  });
  
const Transfer = mongoose.model('Transfer', transferSchema);

app.post('/api/transfer', async (req, res) => {
    const { senderId, receiverEmail, amount, message } = req.body;
  
    if (!senderId || !receiverEmail || !amount) {
      return res.status(400).json({ message: 'Données manquantes.' });
    }
  
    try {
      const sender = await User.findById(senderId);
      const receiver = await User.findOne({ email: receiverEmail });
  
      if (!sender || !receiver) {
        return res.status(404).json({ message: 'Expéditeur ou destinataire introuvable.' });
      }
  
      if (sender.balance < amount) {
        return res.status(400).json({ message: 'Solde insuffisant.' });
      }
  
      // 💸 Process transfer
      sender.balance -= amount;
      receiver.balance += amount;
  
      await sender.save();
      await receiver.save();
  
      // 📋 Log transfer
      const newTransfer = new Transfer({
        senderId: sender._id,
        receiverId: receiver._id,
        amount,
        message
      });
  
      await newTransfer.save();
  
      res.status(200).json({ message: 'Transfert effectué avec succès.' });
    } catch (err) {
      console.error('Erreur transfert:', err);
      res.status(500).json({ message: 'Erreur serveur. Veuillez réessayer.' });
    }
  });
  app.get('/api/transfers/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const transfers = await Transfer.find({
        $or: [{ senderId: userId }, { receiverId: userId }]
      }).sort({ timestamp: -1 });
  
      res.status(200).json(transfers);
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de la récupération des transferts.' });
    }
  });
    

const User = mongoose.model('User', userSchema);
const transactionRoutes = require('./api/transactions');
app.use('/api/transactions', transactionRoutes);

// POST /api/signup
app.post('/api/signup', upload.single('idUpload'), async (req, res) => {
  const {
    fullName, email, phone, dob, password, confirmPassword,
    address, nationality, securityAnswer, termsAccepted
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Les mots de passe ne correspondent pas.' });
  }

  if (!termsAccepted) {
    return res.status(400).json({ message: 'Vous devez accepter les termes et conditions.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà existant avec cet email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      phone,
      dob,
      password: hashedPassword,
      address,
      nationality,
      securityAnswer,
      termsAccepted,
      idUpload: req.file ? req.file.path : null
    });

    await newUser.save();
    res.status(201).json({ message: 'Utilisateur créé avec succès.' });

  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Erreur interne du serveur. Veuillez réessayer.' });
  }
});
app.post('/api/seed-transactions', async (req, res) => {
    const { userId } = req.body;
    const sampleTx = [
      { label: 'Courses', amount: 120, category: 'Alimentation', date: '2025-07-01' },
      { label: 'Essence', amount: 60, category: 'Transport', date: '2025-07-03' },
      { label: 'Abonnement Netflix', amount: 15, category: 'Divertissement', date: '2025-07-05' },
      { label: 'Facture EDF', amount: 80, category: 'Logement', date: '2025-07-08' },
      { label: 'Restaurant', amount: 45, category: 'Sorties', date: '2025-07-10' },
    ];
  
    try {
      await Transaction.insertMany(sampleTx.map(tx => ({ ...tx, userId })));
      res.status(201).json({ message: 'Transactions fictives ajoutées.' });
    } catch (err) {
      res.status(500).json({ message: 'Erreur de seed.' });
    }
  });
  
const transactions = [
    { id: 1, description: 'Salaire', amount: 2500, date: '2025-07-01' },
    { id: 2, description: 'Supermarché', amount: -120, date: '2025-07-04' },
    { id: 3, description: 'Loyer', amount: -800, date: '2025-07-05' },
    { id: 4, description: 'Vente eBay', amount: 100, date: '2025-07-10' },
    { id: 5, description: 'Netflix', amount: -13.99, date: '2025-07-14' }
  ];
  
  app.get('/api/transactions', (req, res) => {
    res.json(transactions);
  });
  
// Define schema for Transactions
const transactionSchema = new mongoose.Schema({
    userId: String,
    label: String,
    amount: Number,
    category: String,
    date: String
  });
  
const Transaction = require('./models/Transaction'); // Adjust path as needed
  
  // Define schema for Budget
  const budgetSchema = new mongoose.Schema({
    userId: String,
    amount: Number
  });
  
  const Budget = require('./models/Budget'); // Adjust path as needed
  
  // POST: Save new transaction
  app.post('/api/transactions', async (req, res) => {
    const { userId, label, amount, category, date } = req.body;
    try {
      const tx = new Transaction({ userId, label, amount, category, date });
      await tx.save();
      res.status(201).json(tx);
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de l\'ajout.' });
    }
  });
  
  // GET: Fetch user transactions
  app.get('/api/transactions/:userId', async (req, res) => {
    try {
      const transactions = await Transaction.find({ userId: req.params.userId });
      res.json(transactions);
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors du chargement.' });
    }
  });
  
  // POST: Set user budget
  app.post('/api/budget', async (req, res) => {
    const { userId, amount } = req.body;
    try {
      const existing = await Budget.findOneAndUpdate(
        { userId },
        { amount },
        { upsert: true, new: true }
      );
      res.status(200).json(existing);
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de l\'enregistrement.' });
    }
  });
  
  // GET: Get user budget
  app.get('/api/budget/:userId', async (req, res) => {
    try {
      const budget = await Budget.findOne({ userId: req.params.userId });
      res.json(budget || { amount: 0 });
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  });
  
// POST /api/login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Mot de passe incorrect.' });
    }

    // Return user info + mock token
    res.status(200).json({
      token: 'mocked-token-12345', // Replace with JWT later if needed
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      message: 'Connexion réussie.'
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Erreur interne du serveur. Veuillez réessayer.' });
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test root route
app.get('/', (req, res) => {
  res.send('Cash Horizon Backend is running!');
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
