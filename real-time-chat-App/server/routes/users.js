const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const User = require('../models/User');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads', 'avatars'));
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, req.user.id + ext);
  }
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

// upload avatar
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'user not found' });
    user.avatarUrl = `/uploads/avatars/${req.user.id}${require('path').extname(req.file.originalname) || '.jpg'}`;
    await user.save();
    res.json({ message: 'uploaded', avatarUrl: user.avatarUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
