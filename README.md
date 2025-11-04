# 🗨️ Real-Time Chat App  

**Full-Stack MERN + Socket.IO Application with JWT Auth, Email Verification, Avatars, and Message Editing**

---

## 📘 Overview

**Real-Time Chat App** is a modern messaging platform built on the MERN stack with live communication powered by Socket.IO.  
It offers secure user authentication, email verification via Gmail SMTP, profile avatars, real-time messaging, message editing & deletion, and scalable pagination.  
The project supports both **local development** and **Dockerized deployment**.

---

## 🧩 Features

| Category | Feature |
|-----------|----------|
| 🔐 Authentication | JWT-based login / register with hashed passwords |
| ✉️ Email Verification | Gmail SMTP integration using Nodemailer |
| 🖼️ Profile Avatars | Image upload via Multer, served statically |
| 💬 Messaging | Real-time text chat (Socket.IO) with per-room support |
| ✏️ Message Editing | Edit and broadcast updated messages instantly |
| 🗑️ Message Deletion | Delete own messages; event syncs across clients |
| 📜 Pagination | Infinite scroll (50 messages per page) |
| 👥 Admin Account |: **admin / uyeetoqpcimvblxc** |
| 🐳 Docker Ready | Runs MongoDB, server, and client via docker-compose |
| 🧪 Testing | Health & registration smoke tests in `/tests` |

---

## 🧱 Tech Stack

**Frontend:** React 18 + Vite + Socket.IO-Client  
**Backend:** Node.js 18 + Express 4 + Socket.IO 4 + Mongoose 7  
**Database:** MongoDB 6 (Local or Atlas)  
**Auth & Email:** bcryptjs + jsonwebtoken + nodemailer  
**Uploads:** multer  
**DevOps:** Docker Compose  

---

## 🗂️ Project Structure

```real-time-chat-App/
├── client/                  # React + Vite frontend
├── server/                  # Express + Socket.IO backend
│   ├── models/              # Mongoose schemas (User, Message)
│   ├── routes/              # Auth, Users, Messages endpoints
│   ├── middleware/          # JWT auth middleware
│   └── uploads/avatars/     # Profile pictures
├── tests/                   # Smoke & integration scripts
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Environment Variables

### 🔧 Server (`server/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/realtime_chat
JWT_SECRET=af23ab5a8a172e24c6d2a4a7004c2ed21b067dbeb63d54e81f50a1db2423f257df4beecb87ee91e806baeea6f65506cee245c80693227b7107b31840629b1259
MONGODB_URI_ATLAS=mongodb+srv://engineeredrisabdella_db_user:
CLIENT_URL=http://localhost:5173

# Gmail SMTP (Used Google App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=edrisabdella178@gmail.com
SMTP_PASS=uyeetoqpcimvblxc
EMAIL_FROM="Real-Time Chat <edrisabdella178@gmail.com>"
```

### 💻 Client (`client/.env`)

```env
VITE_SOCKET_URL=http://localhost:5000
VITE_API_URL=http://localhost:5000
```

---

## 🚀 Running Locally (Recommended)

### 1️⃣ Backend

```bash
cd server
npm install
copy .env.example .env   # or cp .env.example .env
npm run start
```

Expected:

```
Connected to MongoDB
Server listening on port 5000
Created admin user -> username: admin password: uyeetoqpcimvblxc
```

### 2️⃣ Frontend

```bash
cd client
npm install
npm run dev
```

Open 👉 [http://localhost:5173](http://localhost:5173)

---

## 🐳 Running with Docker Compose

```bash
cd real-time-chat-App
docker compose up --build
```

| Service | Port | Description |
|----------|------|-------------|
| MongoDB | 27017 | Database |
| Server | 5000 | Express + Socket.IO |
| Client | 5173 | React UI (Nginx) |

Stop: `Ctrl +C` or `docker compose down`

---

## 📬 Email Verification Workflow

1. User registers → backend sends Gmail SMTP verification email.  
2. User clicks verification link → `/api/auth/verify/:token`.  
3. Account marked verified → user can now log in.

---

## 🖼️ Profile Avatar Upload

After logging in:

- Use the sidebar file input to upload an image (`PNG/JPG < 2 MB`).
- File saved under `server/uploads/avatars/{userId}.jpg`
- URL stored in user profile and displayed in chat.

---

## ✏️ Editing & Deleting Messages

- Click **Edit** or **Delete** on your own message.  
- Edits are saved via PATCH `/api/messages/:id` and broadcast live via Socket.IO.  
- Deletes emit `messageDeleted` event to all clients.

---

## 📜 Pagination

The backend returns the 50 most recent messages per page:

```
GET /api/messages?room=global&page=2&limit=50
```

---

## 🧪 Testing API

Run a quick health check:

```bash
cd tests
node advanced-smoke.js
```

Expected:

```
health { status: 'ok' }
register status 200 ...
```

---

## 🧠 Security & Best Practices
  
- Used HTTPS in production.  
- Setted strong `JWT_SECRET` values.  
- Limit file size for uploads.  
- Used rate limiting / helmet for extra security.

---

## 📦 Deployment

- Deployed on GitHub: [deployment pages](https://edrisabdella.github.io/PLP-MERN-Stack-Development-real-time-communication-with-socket-io-Edrisabdella/)

    Further deployment will be as following
- Host backend on Render / Railway / Vercel (backend).  
- Use MongoDB Atlas for DB.  
- Build frontend with:

  ```bash
  cd client
  npm run build
  ```

  → deploy `dist/` to Netlify or Vercel.  
- Update CORS and CLIENT_URL to your production domain.

---

## 🧑‍💻 Project Maintainer

**Edris Abdella**  
📍 Dire Dawa, Ethiopia  
📧 [edrisabdella178@gmail.com](mailto:edrisabdella178@gmail.com)  
🔗 [LinkedIn: Edris Abdella](https://www.linkedin.com/in/edris-abdella-7aa521177)  
📞 +251 905 131 051  

---

## 💚
