import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import api from '../../utils/api';
import {
  HiOutlineHome,
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineChatAlt2,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
} from 'react-icons/hi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notification count on mount
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get('/notifications');
        setUnreadCount(res.data.unreadCount || 0);
      } catch {
        // fail silently
      }
    };
    if (user) fetchUnread();
  }, [user]);

  // Listen for real-time notifications to bump the badge
  useEffect(() => {
    if (!socket) return;
    const handler = () => setUnreadCount((prev) => prev + 1);
    socket.on('receiveNotification', handler);
    return () => socket.off('receiveNotification', handler);
  }, [socket]);

  // Reset badge when visiting notifications page
  useEffect(() => {
    if (location.pathname === '/notifications') {
      setUnreadCount(0);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation items
  const navItems = [
    { path: '/', icon: HiOutlineHome, label: 'Home' },
    { path: '/search', icon: HiOutlineSearch, label: 'Search' },
    { path: '/chat', icon: HiOutlineChatAlt2, label: 'Chat' },
    { path: '/notifications', icon: HiOutlineBell, label: 'Notifications' },
  ];

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
              Connect<span className="text-primary-600">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const isNotif = item.path === '/notifications';
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="relative">
                    <item.icon className="text-xl" />
                    {isNotif && unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side: Profile & Actions */}
          <div className="flex items-center gap-3">
            {/* Profile link */}
            <Link
              to={`/profile/${user?.username}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center">
                {user?.profilePicture ? (
                  <img
                    src={`http://localhost:5000${user.profilePicture}`}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {(user?.username?.[0] || 'U').toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:block">
                {user?.username}
              </span>
            </Link>

            {/* Settings */}
            <Link
              to="/settings"
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <HiOutlineCog className="text-xl" />
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
              title="Logout"
            >
              <HiOutlineLogout className="text-xl" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? (
                <HiOutlineX className="text-xl" />
              ) : (
                <HiOutlineMenu className="text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 dark:border-gray-800 mt-2 pt-3">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className="text-xl" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
