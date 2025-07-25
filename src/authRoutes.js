const express = require('express');
const router = express.Router();
const { registerUser } = require('./authController'); // Import register function

// POST route for user registration
router.post('/register', registerUser);

module.exports = router;
