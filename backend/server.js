const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// server.js (맨 아래에 추가하면 돼)
app.get('/', (req, res) => {
  res.send('Rust Team Finder backend is running!');
});
const path = require('path');

// 정적 파일 서빙 (프론트엔드 HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../pages')));

// 루트 URL에 index.html 띄우기
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../pages/index.html'));
});

