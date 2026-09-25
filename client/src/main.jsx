import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import App from './App';
import './index.css';

// Apply dark mode BEFORE React renders (avoids flash)
const savedDarkMode = localStorage.getItem('darkMode');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (savedDarkMode === 'true' || (savedDarkMode === null && prefersDark)) {
  document.documentElement.classList.add('dark');
}

// Entry point — wrap app with all providers:
// 1. BrowserRouter  — enables routing (page navigation)
// 2. AuthProvider   — provides login/logout/user state globally
// 3. SocketProvider — provides real-time Socket.IO connection
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
