import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../utils/api';
import {
  HiOutlineFire,
  HiOutlineUserGroup,
  HiOutlineBookmark,
  HiOutlineTrendingUp,
} from 'react-icons/hi';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const quickLinks = [
    { icon: HiOutlineFire, label: 'Trending', path: '/trending', activeColor: 'text-amber-500 bg-amber-500/10' },
    { icon: HiOutlineUserGroup, label: 'Discover & Search', path: '/search', activeColor: 'text-cyan-500 bg-cyan-500/10' },
    { icon: HiOutlineBookmark, label: 'Saved Posts', path: '/saved', activeColor: 'text-teal-500 bg-teal-500/10' },
    { icon: HiOutlineTrendingUp, label: 'Live Analytics', path: '/analytics', activeColor: 'text-blue-500 bg-blue-500/10' },
  ];

  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-20 space-y-5">
        {/* Profile Card */}
        <div className="card border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 via-cyan-500 to-emerald-400 rounded-full flex items-center justify-center mb-3 shadow-lg shadow-teal-500/20 overflow-hidden ring-2 ring-cyan-400/30">
              {user?.profilePicture ? (
                <img
                  src={getImageUrl(user.profilePicture)}
                  alt={user.username}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-2xl">
                  {(user?.username?.[0] || 'U').toUpperCase()}
                </span>
              )}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">
              {user?.fullName || user?.username}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              @{user?.username}
            </p>
            <div className="flex gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 w-full justify-center">
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-white text-sm">
                  {user?.followers?.length || 0}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-0.5">
                  Followers
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-white text-sm">
                  {user?.following?.length || 0}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-0.5">
                  Following
                </div>
              </div>
            </div>
            <Link
              to={`/profile/${user?.username}`}
              className="mt-4 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors uppercase tracking-wider"
            >
              View Full Profile →
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="card border border-gray-100 dark:border-gray-800 shadow-sm">
          <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-xs uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            Quick Navigation
          </h4>
          <div className="space-y-1">
            {quickLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all ${
                    isActive
                      ? `${item.activeColor} font-semibold shadow-xs`
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <item.icon className={`text-lg ${isActive ? '' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 text-xs text-gray-400 dark:text-gray-600">
          <p className="font-medium">© ConnectHub Inc.</p>
          <p className="mt-0.5">Real-time social networking & engagement platform.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

