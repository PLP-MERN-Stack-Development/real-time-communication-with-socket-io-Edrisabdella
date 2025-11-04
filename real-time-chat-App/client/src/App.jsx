import React, { useEffect, useState, useRef } from 'react';
import { createSocket, useSocket } from './socket';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function authFetch(path, opts={}){
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  return fetch(API + path, { ...opts, headers });
}

function Login({ onAuth }){
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState('');

  async function doLogin(e){
    e.preventDefault();
    setErr('');
    const res = await fetch(API + '/api/auth/login', {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username,password})
    });
    const data = await res.json();
    if (!res.ok) { setErr(data.error || 'login failed'); return; }
    localStorage.setItem('token', data.token); localStorage.setItem('username', data.username); localStorage.setItem('userId', data.id);
    onAuth(data);
  }

  return (<div className="auth">
    <h3>Login</h3>
    <form onSubmit={doLogin}>
      <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button>Login</button>
      {err && <div className="err">{err}</div>}
    </form>
  </div>);
}

function Register({ onAuth }){
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [email,setEmail]=useState('');
  const [err,setErr]=useState('');

  async function doRegister(e){
    e.preventDefault();
    setErr('');
    const res = await fetch(API + '/api/auth/register', {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username,password,email})
    });
    const data = await res.json();
    if (!res.ok) { setErr(data.error || 'register failed'); return; }
    alert('Registered. Please check your email for verification link.');
  }

  return (<div className="auth">
    <h3>Register</h3>
    <form onSubmit={doRegister}>
      <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button>Register</button>
    </form>
  </div>);
}

export default function App(){
  const [user, setUser] = useState(() => ({ username: localStorage.getItem('username') || null, id: localStorage.getItem('userId') || null }));
  const [socket, setSocket] = useState(null);
  const [page, setPage] = useState(1);
  const socketRef = useRef(null);
  const PAGE_SIZE = 50;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const s = createSocket(token);
      setSocket(s);
    }
  }, []);

  useEffect(() => {
    if (!socket) return;
    socketRef.current = socket;
    socket.connect();
    return () => socket.disconnect();
  }, [socket]);

  const { isConnected, messages, typingUsers, sendMessage } = useSocket(socket || null);

  useEffect(() => {
    // if first load and logged in, join room
    if (socket) socket.emit('join', 'global');
  }, [socket]);

  function handleAuth(data){
    setUser({ username: data.username, id: data.id });
    if (socketRef.current) socketRef.current.disconnect();
    const s = createSocket(localStorage.getItem('token'));
    setSocket(s);
  }

  const doLogout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('username'); localStorage.removeItem('userId');
    setUser({ username: null, id: null });
    if (socketRef.current) socketRef.current.disconnect();
    setSocket(null);
  };

  const handleSend = (text) => {
    if (!socket) return alert('connect first');
    sendMessage(text, 'global', user.username || localStorage.getItem('username') || 'Anonymous');
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('login required');
    const res = await fetch(`${API}/api/messages/${id}`, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } });
    if (res.ok) { /* handled by socket event */ } else { const d=await res.json(); alert(d.error||'delete failed'); }
  };

  const handleEdit = async (id, newText) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('login required');
    const res = await fetch(`${API}/api/messages/${id}`, { method: 'PATCH', headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify({ text: newText }) });
    if (res.ok) { /* update via socket */ } else { const d=await res.json(); alert(d.error||'edit failed'); }
  };

  const uploadAvatar = async (file) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('login required');
    const fd = new FormData(); fd.append('avatar', file);
    const res = await fetch(`${API}/api/users/avatar`, { method: 'POST', body: fd, headers: { 'Authorization': 'Bearer ' + token } });
    if (res.ok) { const d = await res.json(); alert('Avatar uploaded'); localStorage.setItem('avatarUrl', d.avatarUrl); } else { alert('upload failed'); }
  };

  return (
    <div className="app">
      <header>
        <h1>Real-Time Chat Pro</h1>
        <div className="controls">
          {user.username ? (
            <div>
              <span>Signed in as <strong>{user.username}</strong></span>
              <button onClick={doLogout}>Logout</button>
            </div>
          ) : (
            <div>Not signed in</div>
          )}
        </div>
      </header>

      <main className="container">
        <aside className="sidebar">
          {!user.username && <div>
            <Login onAuth={handleAuth} />
            <Register onAuth={handleAuth} />
          </div>}
          {user.username && <div>
            <input type="file" onChange={e=>uploadAvatar(e.target.files[0])} />
          </div>}
        </aside>

        <section className="chat">
          <div className="messages">
            {messages.map(m => (
              <MessageItem key={m._id} m={m} onDelete={handleDelete} onEdit={handleEdit} />
            ))}
          </div>

          {user.username && <div className="composer">
            <Composer onSend={handleSend} />
          </div>}
        </section>
      </main>
    </div>
  );
}

function Composer({ onSend }){
  const [text, setText] = useState('');
  const send = (e) => { e.preventDefault(); if(!text.trim()) return; onSend(text); setText(''); };
  return (<form onSubmit={send} className="composer-form">
    <input value={text} onChange={e=>setText(e.target.value)} placeholder="Message..." />
    <button>Send</button>
  </form>);
}

function MessageItem({ m, onDelete, onEdit }){
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(m.text);
  const userId = localStorage.getItem('userId');
  const my = userId && String(userId) === String(m.userId);
  return (<div className="msg">
    <div className="meta">
      <div><img src={m.avatarUrl||('/uploads/avatars/default.png')} alt="avatar" style={{width:32,height:32,borderRadius:16,marginRight:8}} /> <strong>{m.username}</strong></div>
      <div>{new Date(m.createdAt).toLocaleString()} {m.edited && <em>(edited)</em>}</div>
    </div>
    <div className="text">
      {editing ? <input value={val} onChange={e=>setVal(e.target.value)} /> : <span>{m.text}</span>}
    </div>
    {my && <div style={{marginTop:8}}>
      {editing ? <><button onClick={()=>{ onEdit(m._id,val); setEditing(false); }}>Save</button><button onClick={()=>setEditing(false)}>Cancel</button></> : <><button onClick={()=>setEditing(true)}>Edit</button><button onClick={()=>onDelete(m._id)}>Delete</button></>}
    </div>}
  </div>);
}
