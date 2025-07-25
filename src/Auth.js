// src/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./User');
const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, phone, dob, password, confirmPassword, address, nationality, securityAnswer, termsAccepted } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Les mots de passe ne correspondent pas.' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
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
    });

    // Save user to database
    await newUser.save();

    // Send success response
    res.status(201).json({ message: 'Utilisateur créé avec succès!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de l\'inscription.' });
  }
});

module.exports = router;
