# 🌐 ConnectHub — Full-Stack Social Media App

A modern, full-stack social media platform built as a B.Tech Final Year Project.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS v3, React Router v6 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose ODM |
| **Auth** | JWT (JSON Web Tokens), bcryptjs |
| **Real-time** | Socket.IO |
| **File Upload** | Multer |
| **HTTP Client** | Axios |
| **Notifications** | react-hot-toast |

## ✨ Features

- 🌟 **Landing Page** — High-converting landing page with Hero section, interactive live feature playground, Bento grid architecture, tech stack showcase, testimonials & FAQ
- 🔐 **Authentication** — Register, Login, JWT-based protected routes
- 📰 **Feed** — Paginated home feed with post cards
- 📝 **Posts** — Create, edit, delete posts with image upload
- ❤️ **Engagement** — Like/unlike posts, add & delete comments
- 👤 **Profiles** — View profiles, edit bio & profile picture
- 👥 **Social** — Follow / unfollow users
- 🔍 **Search** — Search users by name or username
- 💬 **Real-time Chat** — Socket.IO powered instant messaging
- 🔔 **Notifications** — Live notifications for likes, comments, follows
- ⚙️ **Settings** — Change password, notification preferences
- 🌙 **Dark Mode** — System-aware dark/light theme toggle


## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas (cloud)

### Installation

```bash
# 1. Clone the project
git clone <repo-url>
cd connecthub

# 2. Install all dependencies (root + server + client)
npm run install-all

# 3. Configure environment variables
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI and JWT secret
```

### Running the App

```bash
# Run BOTH frontend and backend simultaneously (recommended)
npm run dev

# Or run separately:
npm run server   # Backend only  → http://localhost:5000
npm run client   # Frontend only → http://localhost:5173
```

## 📁 Project Structure

```
connecthub/
├── client/                    # React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── layout/        # Navbar, Sidebar, Layout
│       │   ├── PostCard/      # CreatePost, PostCard
│       │   └── common/        # ProtectedRoute
│       ├── context/           # AuthContext, SocketContext
│       ├── pages/             # All 8 pages
│       └── utils/api.js       # Axios instance with JWT
│
└── server/                    # Node.js + Express backend
    ├── config/db.js           # MongoDB connection
    ├── controllers/           # Business logic (5 controllers)
    ├── middleware/            # JWT auth, Multer, error handler
    ├── models/                # Mongoose schemas (4 models)
    └── routes/                # API routes (5 routers)
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/posts/feed` | Get paginated feed |
| POST | `/api/posts` | Create post |
| PUT | `/api/posts/:id/like` | Like / unlike |
| POST | `/api/posts/:id/comment` | Add comment |
| GET | `/api/users/profile/:username` | Get profile |
| PUT | `/api/users/follow/:id` | Follow / unfollow |
| GET | `/api/users/search?q=` | Search users |
| GET | `/api/chat/conversations` | Get conversations |
| POST | `/api/chat/messages/:userId` | Send message |
| GET | `/api/notifications` | Get notifications |

## 📄 License
MIT — Free to use for educational purposes.
