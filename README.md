# Real-Time Chat Application with Socket.io
# Real-Time Communication with Socket.IO

[![GitHub Repo](https://img.shields.io/badge/GitHub-PLP--MERN--Stack--Development-blue)](https://github.com/PLP-MERN-Stack-Development/real-time-communication-with-socket-io-Edrisabdella.git)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Edris%20Abdella-blue)](https://www.linkedin.com/in/edris-abdella-7aa521177)

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Usage](#usage)
- [Authentication](#authentication)
- [Real-Time Features](#real-time-features)
- [Reference Files](#reference-files)
- [Contact](#contact)

---

## Project Overview

This project is a **Real-Time Communication Application** built using **Node.js, Express, Socket.IO, and MongoDB**. Users can send messages in real-time, register, login, and authenticate via JWT. The project supports multiple clients and includes a simple chat UI for testing.  

---

## Features

- User registration and login with **JWT authentication**
- Real-time messaging using **Socket.IO**
- Private messaging and broadcasting
- Message deletion and pagination
- MongoDB for persistent storage
- Docker-ready for easy deployment
- Environment variable configuration for production and development

---

## Technologies

- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas or local)
- **Real-Time Communication:** Socket.IO
- **Authentication:** JWT
- **Dev Tools:** Nodemon, dotenv
- **Optional:** Docker Compose

---

## Project Structure

real-time-communication-with-socket-io-Edrisabdella/
│
├── server.js # Main server entry point
├── socket.js # Socket.IO connection handling
├── package.json # NPM dependencies and scripts
├── .env # Environment variables
├── README.md # Project documentation
├── client/ # Optional front-end folder (HTML, React, or Vue)
│ └── index.html
└── models/ # Mongoose schemas
├── User.js
└── Message.js

yaml
Copy code

---

## Environment Variables

Create a `.env` file in the root directory with the following:

```env
PORT=5000
MONGODB_URI=mongodb+srv://edrisabdella178_db_user:mern***@cluster0.zmfeu2j.mongodb.net/mern-blog-db?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
JWT_SECRET=ADMIN123
You can switch MONGODB_URI to a local MongoDB if needed:

env
Copy code
MONGODB_URI=mongodb://localhost:27017/realtime_chat
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/PLP-MERN-Stack-Development/real-time-communication-with-socket-io-Edrisabdella.git
cd real-time-communication-with-socket-io-Edrisabdella
Install dependencies:

bash
Copy code
npm install
Start the development server:

bash
Copy code
npm run dev
Start the production server:

bash
Copy code
npm start
Usage
Visit http://localhost:5000/ to test the server.

Connect clients via Socket.IO using the /socket.io endpoint.

Register users and authenticate via JWT.

Send and receive messages in real-time.

Authentication
Users can register with username and password.

Passwords are hashed before saving to MongoDB.

JWT is used for session management.

Example: Authorization: Bearer <token> in HTTP headers.

Real-Time Features
Socket.IO enables instant message delivery.

Private messaging supported by specifying recipient ID.

Broadcast messages to all connected users.

Messages are saved in MongoDB.

Optional message deletion and pagination for chat history.

Reference Files
server.js – Node.js server setup

socket.js – Socket.IO connection and event handling

models/User.js – Mongoose user schema

models/Message.js – Mongoose message schema

client/index.html – Minimal front-end for testing

All reference files are included in the repository for full execution.

Contact
Name: Edris Abdella

Email: edrisabdella178@gmail.com

Phone: +251905131051

LinkedIn: https://www.linkedin.com/in/edris-abdella-7aa521177
Deplyoment:[github pages](https://edrisabdella.github.io/
PLP-MERN-Stack-Development-real-time-communication-with-socket-io-Edrisabdella/)
GitHub: https://github.com/PLP-MERN-Stack-Development/real-time-communication-with-socket-io-Edrisabdella.git

Location: Dire Dawa, Ethiopia

Profile Image: https://ibb.co/RT6rny3B


## Files Included

- `Week5-Assignment.md`: Detailed assignment instructions
- Starter code for both client and server:
  - Basic project structure
  - Socket.io configuration templates
  - Sample components for the chat interface

## Requirements

- Node.js (v18 or higher)
- npm or yarn
- Modern web browser
- Basic understanding of React and Express

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Complete both the client and server portions of the application
2. Implement the core chat functionality
3. Add at least 3 advanced features
4. Document your setup process and features in the README.md
5. Include screenshots or GIFs of your working application
6. Optional: Deploy your application and add the URLs to your README.md

## Resources used

- [Socket.io Documentation](https://socket.io/docs/v4/)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Building a Chat Application with Socket.io](https://socket.io/get-started/chat)
