import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Layout from '../components/layout/Layout';
import api, { getImageUrl } from '../utils/api';
import toast from 'react-hot-toast';
import {
  HiOutlinePaperAirplane,
  HiOutlineSearch,
  HiOutlineChatAlt2,
} from 'react-icons/hi';

const Chat = () => {
  const { user: currentUser } = useAuth();
  const { socket, onlineUsers, sendSocketMessage } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch conversations list
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/chat/conversations');
        setConversations(res.data.conversations);
      } catch {
        toast.error('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // Listen for incoming real-time messages
  useEffect(() => {
    if (!socket) return;

    socket.on('receiveMessage', (message) => {
      // Only add if this message is from the currently open conversation
      if (message.sender._id === selectedUser?._id) {
        setMessages((prev) => [...prev, message]);
      }
      // Update last message in conversations list
      setConversations((prev) => {
        const exists = prev.find(
          (c) => c.conversationId === message.conversationId
        );
        if (exists) {
          return prev.map((c) =>
            c.conversationId === message.conversationId
              ? { ...c, lastMessage: message.text, lastMessageTime: message.createdAt }
              : c
          );
        }
        return prev;
      });
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [socket, selectedUser]);

  // Scroll whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages when a conversation is selected
  const handleSelectConversation = async (convUser) => {
    setSelectedUser(convUser);
    setMessages([]);
    try {
      const res = await api.get(`/chat/messages/${convUser._id}`);
      setMessages(res.data.messages);
      // Mark unread as 0
      setConversations((prev) =>
        prev.map((c) =>
          c.user._id === convUser._id ? { ...c, unreadCount: 0 } : c
        )
      );
    } catch {
      toast.error('Failed to load messages');
    }
  };

  // Send a message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || sending) return;
    setSending(true);

    try {
      const res = await api.post(`/chat/messages/${selectedUser._id}`, {
        text: newMessage.trim(),
      });

      const sentMessage = res.data.message;
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage('');

      // Send via socket for real-time delivery
      sendSocketMessage(selectedUser._id, sentMessage);

      // Update conversation list with latest message
      setConversations((prev) => {
        const exists = prev.find((c) => c.user._id === selectedUser._id);
        if (exists) {
          return prev.map((c) =>
            c.user._id === selectedUser._id
              ? { ...c, lastMessage: sentMessage.text, lastMessageTime: sentMessage.createdAt }
              : c
          );
        }
        return [
          {
            conversationId: sentMessage.conversationId,
            user: selectedUser,
            lastMessage: sentMessage.text,
            lastMessageTime: sentMessage.createdAt,
            unreadCount: 0,
          },
          ...prev,
        ];
      });
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Search for a user to start a new chat
  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await api.get(`/users/search?q=${encodeURIComponent(q)}`);
      setSearchResults(res.data.users.slice(0, 5));
    } catch {
      // fail silently
    }
  };

  // Format time
  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatConvTime = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - d) / 86400000);
    if (diffDays === 0) return formatTime(dateStr);
    if (diffDays === 1) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Layout>
      <div className="card p-0 overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>
        <div className="flex h-full">
          {/* ===== Left: Conversations Panel ===== */}
          <div className="w-80 border-r border-gray-100 dark:border-gray-800 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Messages
              </h2>
              {/* Search to start new chat */}
              <div className="relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search to start a chat..."
                  className="input-field pl-10 py-2 text-sm"
                />
              </div>
              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute z-20 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 mt-1 w-72">
                  {searchResults.map((u) => (
                    <button
                      key={u._id}
                      onClick={() => {
                        handleSelectConversation(u);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-teal-400 via-cyan-500 to-emerald-400 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white text-sm font-bold">
                          {(u.username?.[0] || 'U').toUpperCase()}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {u.fullName || u.username}
                        </p>
                        <p className="text-xs text-gray-400">@{u.username}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Conversations list */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-36" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <HiOutlineChatAlt2 className="text-5xl text-gray-300 dark:text-gray-700 mb-3" />
                  <p className="text-sm text-gray-400">
                    No conversations yet. Search for a user to start chatting!
                  </p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const isOnline = onlineUsers.includes(conv.user._id);
                  const isSelected = selectedUser?._id === conv.user._id;
                  return (
                    <button
                      key={conv.conversationId}
                      onClick={() => handleSelectConversation(conv.user)}
                      className={`flex items-center gap-3 w-full px-4 py-3.5 transition-colors text-left ${
                        isSelected
                          ? 'bg-primary-50 dark:bg-primary-900/20'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-cyan-500 to-emerald-400 rounded-full flex items-center justify-center shadow-sm">
                          {conv.user.profilePicture ? (
                            <img
                              src={getImageUrl(conv.user.profilePicture)}
                              alt={conv.user.username}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-bold">
                              {(conv.user.username?.[0] || 'U').toUpperCase()}
                            </span>
                          )}
                        </div>
                        {isOnline && (
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {conv.user.fullName || conv.user.username}
                          </p>
                          <span className="text-xs text-gray-400 shrink-0 ml-2">
                            {formatConvTime(conv.lastMessageTime)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {conv.lastMessage}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-0.5 shrink-0 ml-2">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ===== Right: Chat Window ===== */}
          <div className="flex-1 flex flex-col">
            {!selectedUser ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <HiOutlineChatAlt2 className="text-4xl text-teal-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Choose a conversation from the left or search for a user to start chatting.
                </p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-400 via-cyan-500 to-emerald-400 rounded-full flex items-center justify-center shadow-sm">
                      {selectedUser.profilePicture ? (
                        <img
                          src={getImageUrl(selectedUser.profilePicture)}
                          alt={selectedUser.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-sm">
                          {(selectedUser.username?.[0] || 'U').toUpperCase()}
                        </span>
                      )}
                    </div>
                    {onlineUsers.includes(selectedUser._id) && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedUser.fullName || selectedUser.username}
                    </p>
                    <p className="text-xs text-gray-400">
                      {onlineUsers.includes(selectedUser._id)
                        ? '🟢 Online'
                        : 'Offline'}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <p className="text-gray-400 text-sm">
                        No messages yet. Say hello! 👋
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isOwn = msg.sender._id === currentUser?._id || msg.sender === currentUser?._id;
                      return (
                        <div
                          key={msg._id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isOwn && (
                            <div className="w-7 h-7 bg-gradient-to-br from-teal-400 via-cyan-500 to-emerald-400 rounded-full flex items-center justify-center mr-2 mt-1 shrink-0 shadow-sm">
                              <span className="text-white text-xs font-bold">
                                {(selectedUser.username?.[0] || 'U').toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className={`max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                            <div
                              className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                isOwn
                                  ? 'bg-primary-600 text-white rounded-br-sm'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm'
                              }`}
                            >
                              {msg.text}
                            </div>
                            <span className="text-xs text-gray-400 mt-1 px-1">
                              {formatTime(msg.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form
                  onSubmit={handleSend}
                  className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800"
                >
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="input-field py-2.5 text-sm flex-1"
                    maxLength={2000}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="w-11 h-11 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
                  >
                    <HiOutlinePaperAirplane className="text-xl rotate-90" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
