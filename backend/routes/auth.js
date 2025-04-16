const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hash });
        await newUser.save();
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        res.status(400).json({ error: 'Signup failed' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Wrong password' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ token, username: user.username });
    } catch (err) {
        res.status(400).json({ error: 'Login failed' });
    }
});

module.exports = router;
