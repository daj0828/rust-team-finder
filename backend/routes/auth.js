const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password, nickname, discord } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: '이미 가입된 이메일입니다.' });

  const hash = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hash, nickname, discord });
  await newUser.save();
  res.status(201).json({ message: '회원가입 성공' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: '유효하지 않은 사용자입니다.' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: '비밀번호가 틀렸습니다.' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, user: { nickname: user.nickname, discord: user.discord } });
});

module.exports = router;
