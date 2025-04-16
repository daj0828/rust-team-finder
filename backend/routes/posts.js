const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// 글 작성
router.post('/', async (req, res) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 전체 글 조회
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ timestamp: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


router.post('/', async (req, res) => {
  const { title, content, username, nickname, discord } = req.body;
  const posts = await fs.readJson(postsPath).catch(() => []);
  const newPost = {
    id: Date.now(),
    title,
    content,
    username,
    nickname,
    discord,
    timestamp: new Date().toISOString(),
    likes: 0,
    comments: [],
    pinned: false
  };
  posts.unshift(newPost);
  await fs.writeJson(postsPath, posts);
  res.json(newPost);
});

router.post('/:id/like', async (req, res) => {
  const posts = await fs.readJson(postsPath).catch(() => []);
  const post = posts.find(p => p.id == req.params.id);
  if (post) post.likes++;
  await fs.writeJson(postsPath, posts);
  res.json({ likes: post.likes });
});

router.post('/:id/pin', async (req, res) => {
  const posts = await fs.readJson(postsPath).catch(() => []);
  const post = posts.find(p => p.id == req.params.id);
  if (post) post.pinned = !post.pinned;
  await fs.writeJson(postsPath, posts);
  res.json({ pinned: post.pinned });
});

router.delete('/:id', async (req, res) => {
  let posts = await fs.readJson(postsPath).catch(() => []);
  posts = posts.filter(p => p.id != req.params.id);
  await fs.writeJson(postsPath, posts);
  res.json({ message: '삭제됨' });
});

module.exports = router;
