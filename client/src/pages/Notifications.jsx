import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import Layout from '../components/layout/Layout';
import api, { getImageUrl } from '../utils/api';
import toast from 'react-hot-toast';
import {
  HiOutlineBell,
  HiOutlineHeart,
  HiOutlineChatAlt,
  HiOutlineUserAdd,
  HiOutlineTrash,
  HiOutlineCheck,
} from 'react-icons/hi';

const NotificationIcon = ({ type }) => {
  const cls = 'text-lg';
  if (type === 'like') return <HiOutlineHeart className={`${cls} text-red-500`} />;
  if (type === 'comment') return <HiOutlineChatAlt className={`${cls} text-blue-500`} />;
  if (type === 'follow') return <HiOutlineUserAdd className={`${cls} text-green-500`} />;
  return <HiOutlineBell className={cls} />;
};

const Notifications = () => {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      } catch {
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Listen for real-time notifications via Socket.IO
  useEffect(() => {
    if (!socket) return;
    socket.on('receiveNotification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast(`🔔 ${notification.message}`, { duration: 4000 });
    });
    return () => socket.off('receiveNotification');
  }, [socket]);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All marked as read');
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  const formatTime = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    return `${days}d ago`;
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="card">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="bg-primary-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                <HiOutlineCheck className="text-lg" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-11 h-11 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <HiOutlineBell className="text-6xl text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                All caught up!
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                No notifications yet. Start engaging with the community!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800 -mx-6">
              {notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`flex items-start gap-4 px-6 py-4 group transition-colors ${
                    !notif.read
                      ? 'bg-primary-50/50 dark:bg-primary-900/10'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
                  }`}
                >
                  {/* Sender avatar */}
                  <Link to={`/profile/${notif.sender?.username}`} className="shrink-0">
                    <div className="w-11 h-11 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center">
                      {notif.sender?.profilePicture ? (
                        <img
                          src={getImageUrl(notif.sender.profilePicture)}
                          alt={notif.sender.username}
                          className="w-11 h-11 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-sm">
                          {(notif.sender?.username?.[0] || 'U').toUpperCase()}
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <NotificationIcon type={notif.type} />
                      <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug">
                        <Link
                          to={`/profile/${notif.sender?.username}`}
                          className="font-semibold hover:text-primary-600 transition-colors"
                        >
                          {notif.sender?.fullName || notif.sender?.username}
                        </Link>{' '}
                        {notif.type === 'like' && 'liked your post'}
                        {notif.type === 'comment' && 'commented on your post'}
                        {notif.type === 'follow' && 'started following you'}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 ml-6">
                      {formatTime(notif.createdAt)}
                    </p>
                  </div>

                  {/* Unread dot + delete */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!notif.read && (
                      <div className="w-2.5 h-2.5 bg-primary-500 rounded-full" />
                    )}
                    <button
                      onClick={() => handleDelete(notif._id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
                    >
                      <HiOutlineTrash className="text-lg" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;
