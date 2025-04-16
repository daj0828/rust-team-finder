const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');

const postsPath = path.join(__dirname, '../data/posts.json');

router.post('/:id/comment', async (req, res) => {
  const { nickname, text } = req.body;
  const posts = await fs.readJson(postsPath).catch(() => []);
  const post = posts.find(p => p.id == req.params.id);
  if (post) {
    post.comments.push({ nickname, text, time: new Date().toISOString() });
    await fs.writeJson(postsPath, posts);
    res.json(post.comments);
  } else {
    res.status(404).json({ message: '게시물을 찾을 수 없음' });
  }
});

module.exports = router;
