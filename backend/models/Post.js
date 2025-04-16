const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  nickname: String,
  discord: String,
  timestamp: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  pinned: { type: Boolean, default: false },
  comments: [
    {
      author: String,
      content: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Post', postSchema);
