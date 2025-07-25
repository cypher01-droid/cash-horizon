// signup.js (Express route for signup)
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./User');  // Assuming you're using a User model in your MongoDB setup
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { fullName, email, phone, dob, password, confirmPassword, address, nationality, securityAnswer, termsAccepted } = req.body;

  // Basic validation
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Les mots de passe ne correspondent pas.' });
  }

  if (!termsAccepted) {
    return res.status(400).json({ message: 'Vous devez accepter les termes et conditions.' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà existant avec cet email.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
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

    await newUser.save();

    // Return a success message
    res.status(201).json({ message: 'Utilisateur créé avec succès.' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Erreur interne du serveur. Veuillez réessayer.' });
  }
});

module.exports = router;
