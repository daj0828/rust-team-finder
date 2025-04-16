const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// 글 작성
router.post('/', async (req, res) => {
  try {
    const { title, content, nickname, discord } = req.body;
    const newPost = new Post({
      title,
      content,
      nickname,
      discord,
      likes: 0,
      pinned: false,
      comments: [],
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 전체 글 조회 (고정된 글 먼저)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ pinned: -1, timestamp: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 좋아요
router.post('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: '게시글 없음' });
    post.likes++;
    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 고정/해제
router.post('/:id/pin', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: '게시글 없음' });
    post.pinned = !post.pinned;
    await post.save();
    res.json({ pinned: post.pinned });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 삭제
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: '삭제됨' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
