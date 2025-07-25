const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./User');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      'your_jwt_secret', // Replace this with process.env.JWT_SECRET in production
      { expiresIn: '1h' }
    );

    // Respond with token and user info
    res.status(200).json({
      message: 'Connexion réussie!',
      token,
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Erreur interne du serveur. Veuillez réessayer.' });
  }
});

module.exports = router;
