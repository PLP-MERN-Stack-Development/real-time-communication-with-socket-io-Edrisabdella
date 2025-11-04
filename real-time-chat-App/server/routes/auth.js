const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// create nodemailer transporter using env config
function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT||'587',10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) return res.status(400).json({ error: 'username, email and password required' });
    const existingU = await User.findOne({ username });
    if (existingU) return res.status(400).json({ error: 'username taken' });
    const existingE = await User.findOne({ email });
    if (existingE) return res.status(400).json({ error: 'email taken' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = new User({ username, email, passwordHash: hash, verified: false });
    await user.save();

    // send verification email
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify/${token}`;
    const transporter = createTransport();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Verify your Real-Time Chat account',
      text: `Click the link to verify your account: ${verifyUrl}`,
      html: `<p>Click the link to verify your account:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`
    });

    res.json({ message: 'registered, verification email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

router.get('/verify/:token', async (req, res) => {
  try {
    const token = req.params.token;
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(payload.id);
    if (!user) return res.status(404).send('User not found');
    user.verified = true;
    await user.save();
    res.send('Email verified — you can now login.');
  } catch (err) {
    console.error(err);
    res.status(400).send('Invalid or expired token');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'invalid credentials' });
    if (!user.verified) return res.status(403).json({ error: 'email not verified' });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ error: 'invalid credentials' });
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, username: user.username, id: user._id, avatarUrl: user.avatarUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
