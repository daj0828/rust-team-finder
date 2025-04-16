const express = require('express');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const User = require('../models/User');
const router = express.Router();

function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) return res.status(403).json({ error: 'No token' });
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });
        req.userId = decoded.id;
        next();
    });
}

router.post('/', verifyToken, async (req, res) => {
    const post = new Post({ author: req.userId, content: req.body.content });
    await post.save();
    res.json(post);
});

router.get('/', async (req, res) => {
    const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
    res.json(posts);
});

module.exports = router;
