import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineFire,
  HiOutlineUserGroup,
  HiOutlineBookmark,
  HiOutlineTrendingUp,
} from 'react-icons/hi';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-20 space-y-5">
        {/* Profile Card */}
        <div className="card">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center mb-3 shadow-lg shadow-primary-500/20">
              {user?.profilePicture ? (
                <img
                  src={`http://localhost:5000${user.profilePicture}`}
                  alt={user.username}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-2xl">
                  {(user?.username?.[0] || 'U').toUpperCase()}
                </span>
              )}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">
              {user?.fullName || user?.username}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              @{user?.username}
            </p>
            <div className="flex gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 w-full justify-center">
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-white">
                  {user?.followers?.length || 0}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Followers
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-white">
                  {user?.following?.length || 0}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Following
                </div>
              </div>
            </div>
            <Link
              to={`/profile/${user?.username}`}
              className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              View Profile →
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="card">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider">
            Quick Links
          </h4>
          <div className="space-y-1">
            {[
              { icon: HiOutlineFire, label: 'Trending', path: '/' },
              { icon: HiOutlineUserGroup, label: 'Suggestions', path: '/search' },
              { icon: HiOutlineBookmark, label: 'Saved Posts', path: '/' },
              { icon: HiOutlineTrendingUp, label: 'Analytics', path: '/' },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <item.icon className="text-lg text-gray-400" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 text-xs text-gray-400 dark:text-gray-600">
          <p>© 2024 ConnectHub</p>
          <p className="mt-1">Built with ❤️ for learning</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
