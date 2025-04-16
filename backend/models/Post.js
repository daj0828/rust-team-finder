const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  nickname: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  nickname: String,
  discord: String,
  timestamp: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  comments: [commentSchema],
});

module.exports = mongoose.model('Post', postSchema);
