import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { SERVER_URL } from '../utils/api';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect to the backend Socket.IO server
      socketRef.current = io(SERVER_URL, {
        reconnection: true,
        reconnectionAttempts: 5,
        transports: ['websocket', 'polling'],
      });

      // Tell the server who we are
      socketRef.current.emit('addUser', user._id);

      // Listen for the updated list of online users
      socketRef.current.on('getOnlineUsers', (users) => {
        setOnlineUsers(users);
      });

      // Cleanup on unmount or logout
      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  // Helper: send a chat message via socket
  const sendSocketMessage = (receiverId, message) => {
    socketRef.current?.emit('sendMessage', { receiverId, message });
  };

  // Helper: send a notification via socket
  const sendSocketNotification = (receiverId, notification) => {
    socketRef.current?.emit('sendNotification', { receiverId, notification });
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        onlineUsers,
        sendSocketMessage,
        sendSocketNotification,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
