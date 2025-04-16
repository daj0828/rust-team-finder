const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');

const usersPath = path.join(__dirname, '../data/users.json');

router.post('/signup', async (req, res) => {
  const { username, password, nickname, discord } = req.body;
  const users = await fs.readJson(usersPath).catch(() => []);
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
  }
  users.push({ username, password, nickname, discord });
  await fs.writeJson(usersPath, users);
  res.json({ message: '회원가입 성공' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const users = await fs.readJson(usersPath).catch(() => []);
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: '아이디 또는 비밀번호가 틀렸습니다.' });
  res.json(user);
});

module.exports = router;
