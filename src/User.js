// src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  dob: {
    type: Date
  },
  address: {
    type: String
  },
  nationality: {
    type: String
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
