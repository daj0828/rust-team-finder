const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nickname: { type: String, required: true },
  discord: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
