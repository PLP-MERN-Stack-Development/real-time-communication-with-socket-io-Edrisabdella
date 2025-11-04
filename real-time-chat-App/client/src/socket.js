import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export function createSocket(token) {
  const opts = { autoConnect: false, auth: {} };
  if (token) opts.auth.token = token;
  const s = io(SOCKET_URL, opts);
  return s;
}

export function useSocket(socket) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    if (!socket) return;
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onMessage = (m) => setMessages(prev => [...prev, m]);
    const onHistory = (h) => setMessages(h || []);
    const onTyping = (payload) => {
      if (payload && payload.username) {
        setTypingUsers(prev => {
          if (payload.isTyping) {
            return Array.from(new Set([...prev, payload.username]));
          } else {
            return prev.filter(x => x !== payload.username);
          }
        });
      }
    };
    const onMessageEdited = (m) => {
      setMessages(prev => prev.map(x => x._id === m._id ? m : x));
    };
    const onMessageDeleted = ({ id }) => {
      setMessages(prev => prev.filter(x => x._id !== id));
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message', onMessage);
    socket.on('history', onHistory);
    socket.on('typing', onTyping);
    socket.on('messageEdited', onMessageEdited);
    socket.on('messageDeleted', onMessageDeleted);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message', onMessage);
      socket.off('history', onHistory);
      socket.off('typing', onTyping);
      socket.off('messageEdited', onMessageEdited);
      socket.off('messageDeleted', onMessageDeleted);
    };
  }, [socket]);

  const sendMessage = (text, room='global', username='Anonymous') => {
    if (!socket) return;
    socket.emit('chatMessage', { room, username, text });
  };

  return { isConnected, messages, typingUsers, sendMessage };
}
