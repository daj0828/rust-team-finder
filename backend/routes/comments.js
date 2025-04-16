const express = require('express');
const jwt = require('jsonwebtoken');
const CommentModel = require('../models/Comment'); // 이름 충돌 방지
const router = express.Router();

// ✅ 토큰 검증 미들웨어 (dot notation 사용)
function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) return res.status(403).json({ error: 'No token' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });
        req.userId = decoded.id;
        next();
    });
}

// ✅ 댓글 작성
router.post('/:postId', verifyToken, async (req, res) => {
    try {
        const comment = new CommentModel({
            postId: req.params.postId,
            commenter: req.userId,
            text: req.body.text
        });
        await comment.save();
        res.json(comment);
    } catch (err) {
        res.status(500).json({ error: 'Failed to post comment' });
    }
});

// ✅ 댓글 불러오기
router.get('/:postId', async (req, res) => {
    try {
        const comments = await CommentModel.find({ postId: req.params.postId })
            .populate('commenter', 'username')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get comments' });
    }
});

module.exports = router;
