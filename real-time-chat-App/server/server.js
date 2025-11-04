require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const User = require('./models/User');
const Message = require('./models/Message');

const authRoutes = require('./routes/auth');
const messagesRoutes = require('./routes/messages');
const usersRoutes = require('./routes/users');

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || true }));
app.use(express.json());
app.use(morgan('dev'));

// ensure upload folder exists
const avatarsDir = path.join(__dirname, 'uploads', 'avatars');
fs.mkdirSync(avatarsDir, { recursive: true });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ["GET", "POST"]
  }
});

// make io available to routes
app.set('io', io);

const PORT = process.env.PORT || 5000;

// MongoDB connection (atlas preferred)
const atlasUri = process.env.MONGODB_URI_ATLAS;
const localUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/realtime_chat';
const uriToUse = atlasUri && atlasUri.trim() !== '' ? atlasUri : localUri;

mongoose.connect(uriToUse, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB:', uriToUse);
    // ensure admin user exists
    const adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('ADMIN123', salt);
      const u = new User({ username: 'admin', email: 'admin@example.com', passwordHash: hash, verified: true });
      await u.save();
      console.log('Created admin user -> username: admin password: ADMIN123');
    } else {
      console.log('Admin user already exists');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/users', usersRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Socket middleware to validate JWT from client handshake
io.use((socket, next) => {
  const token = socket.handshake.auth && socket.handshake.auth.token;
  if (!token) return next();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    socket.user = payload;
    return next();
  } catch (err) {
    console.warn('Socket auth failed', err.message);
    return next();
  }
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id, 'user=', socket.user ? socket.user.username : 'anon');

  socket.on('join', async (room = 'global') => {
    socket.join(room);
    try {
      const history = await Message.find({ room }).sort({ createdAt: -1 }).limit(50).lean();
      socket.emit('history', history.reverse());
    } catch (err) {
      console.error('Error loading history:', err);
    }
  });

  socket.on('chatMessage', async (data) => {
    try {
      const room = data.room || 'global';
      const username = data.username || (socket.user && socket.user.username) || 'Anonymous';
      const userId = (socket.user && socket.user.id) || null;
      const text = data.text || '';
      const msg = new Message({ room, username, userId, text, createdAt: new Date() });
      const saved = await msg.save();
      io.to(room).emit('message', saved);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('typing', (payload) => {
    const room = (payload && payload.room) || 'global';
    socket.to(room).emit('typing', payload);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = { app, server };
