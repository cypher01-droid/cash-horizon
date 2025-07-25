const User = require('./User'); // Import the User model
const bcrypt = require('bcryptjs'); // To hash passwords
const jwt = require('jsonwebtoken'); // For JWT (we'll use it later for authentication)

// Register User
const registerUser = async (req, res) => {
  const {
    fullName, email, phone, dob, password, address, nationality, idUpload, securityAnswer, termsAccepted
  } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'Cet email est déjà utilisé' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const newUser = new User({
      fullName,
      email,
      phone,
      dob,
      password: hashedPassword,
      address,
      nationality,
      idUpload,
      securityAnswer,
      termsAccepted,
    });

    await newUser.save();
    res.status(201).json({ msg: 'Utilisateur créé avec succès' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Erreur du serveur' });
  }
};

// Export the controller function
module.exports = {
  registerUser,
};
