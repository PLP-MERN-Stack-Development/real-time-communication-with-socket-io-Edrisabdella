const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  room: { type: String, default: 'global' },
  username: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  edited: { type: Boolean, default: false },
  editedAt: { type: Date }
}, { collection: 'messages' });

module.exports = mongoose.model('Message', MessageSchema);
