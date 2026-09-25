const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Create HTTP server (needed for Socket.IO)
const server = http.createServer(app);

// Initialize Socket.IO with CORS settings
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// ===== Middleware =====
// Parse incoming JSON data (req.body)
app.use(express.json());

// Parse URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));

// Allow requests from the React frontend (CORS)
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Serve uploaded files as static assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== API Routes =====
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// ===== Root & Health Routes =====
// Root endpoint — Shows server status and links to frontend
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>ConnectHub API Server</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
        .card { background: #1e293b; padding: 2.5rem; border-radius: 1.5rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); text-align: center; max-width: 500px; width: 100%; border: 1px solid #334155; }
        h1 { color: #818cf8; margin-bottom: 0.5rem; font-size: 2rem; }
        p { color: #94a3b8; line-height: 1.6; font-size: 0.95rem; margin: 0 0 1rem 0; }
        .badge { display: inline-flex; align-items: center; gap: 6px; background: #064e3b; color: #34d399; padding: 0.4rem 1rem; border-radius: 9999px; font-weight: 600; font-size: 0.85rem; margin-bottom: 1.25rem; }
        .btn { display: inline-block; background: #6366f1; color: white; padding: 0.85rem 1.75rem; border-radius: 0.85rem; text-decoration: none; font-weight: bold; margin-top: 1.5rem; transition: all 0.2s; box-shadow: 0 10px 20px -5px rgba(99,102,241,0.4); }
        .btn:hover { background: #4f46e5; transform: translateY(-2px); }
        .endpoints { text-align: left; background: #0f172a; padding: 1rem 1.25rem; border-radius: 0.85rem; margin-top: 1.25rem; font-family: monospace; font-size: 0.82rem; color: #cbd5e1; border: 1px solid #334155; }
        .endpoints div { margin: 4px 0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge"><span style="font-size: 1.2em;">●</span> Backend API Online</div>
        <h1>ConnectHub Server</h1>
        <p>The Node.js & Express REST API is actively running with MongoDB Atlas and Socket.IO real-time engine.</p>
        <div class="endpoints">
          <div>🟢 <strong>Health:</strong> <code>/api/health</code></div>
          <div>🔐 <strong>Auth:</strong> <code>/api/auth</code></div>
          <div>📝 <strong>Posts:</strong> <code>/api/posts</code></div>
          <div>💬 <strong>Chat:</strong> <code>Socket.IO Connected</code></div>
        </div>
        <a class="btn" href="${process.env.CLIENT_URL || 'http://localhost:5173'}">Open Frontend Application →</a>
      </div>
    </body>
    </html>
  `);
});

// Health check endpoint (to test if server is running)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '🚀 ConnectHub API is running!' });
});

// Global error handler (must be AFTER all routes)
app.use(errorHandler);

// ===== Socket.IO — Real-time Communication =====
// Store which users are online: { odueId: socketId }
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  // When a user logs in, register them as "online"
  socket.on('addUser', (userId) => {
    onlineUsers.set(userId, socket.id);
    // Broadcast the list of online users to everyone
    io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
    console.log(`👤 User ${userId} is online. Total: ${onlineUsers.size}`);
  });

  // When a user sends a chat message
  socket.on('sendMessage', (data) => {
    const { receiverId, message } = data;
    const receiverSocketId = onlineUsers.get(receiverId);

    if (receiverSocketId) {
      // Send the message only to the receiver (not broadcast)
      io.to(receiverSocketId).emit('receiveMessage', message);
    }
  });

  // When a notification is triggered (like, comment, follow)
  socket.on('sendNotification', (data) => {
    const { receiverId, notification } = data;
    const receiverSocketId = onlineUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveNotification', notification);
    }
  });

  // When a user disconnects
  socket.on('disconnect', () => {
    // Find and remove the disconnected user
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    // Update everyone with the new online users list
    io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
    console.log(`❌ User disconnected: ${socket.id}. Online: ${onlineUsers.size}`);
  });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;

// Use server.listen instead of app.listen (for Socket.IO)
server.listen(PORT, () => {
  console.log(`\n🚀 ConnectHub Server running on http://localhost:${PORT}`);
  console.log(`⚡ Socket.IO enabled for real-time chat`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
