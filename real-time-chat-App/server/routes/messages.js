const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');

// pagination: /api/messages?room=global&page=1&limit=50
router.get('/', async (req, res) => {
  try {
    const room = req.query.room || 'global';
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const skip = (page - 1) * limit;
    const msgs = await Message.find({ room }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    res.json(msgs.reverse());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// delete message by id (owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const msg = await Message.findById(id);
    if (!msg) return res.status(404).json({ error: 'not found' });
    if (!msg.userId || String(msg.userId) !== String(req.user.id)) return res.status(403).json({ error: 'forbidden' });
    await Message.deleteOne({ _id: id });
    // emit via socket.io (we'll use app-level emitter)
    req.app.get('io') && req.app.get('io').to(msg.room || 'global').emit('messageDeleted', { id });
    res.json({ message: 'deleted', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// edit message
router.patch('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const { text } = req.body;
    const msg = await Message.findById(id);
    if (!msg) return res.status(404).json({ error: 'not found' });
    if (!msg.userId || String(msg.userId) !== String(req.user.id)) return res.status(403).json({ error: 'forbidden' });
    msg.text = text;
    msg.edited = true;
    msg.editedAt = new Date();
    await msg.save();
    req.app.get('io') && req.app.get('io').to(msg.room || 'global').emit('messageEdited', msg);
    res.json({ message: 'edited', msg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
