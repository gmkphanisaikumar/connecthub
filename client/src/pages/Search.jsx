import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  HiOutlineSearch,
  HiOutlineUserAdd,
  HiOutlineUserRemove,
  HiOutlineX,
} from 'react-icons/hi';

const Search = () => {
  const { user: currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [followingMap, setFollowingMap] = useState({});

  // Load follow suggestions on mount
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const res = await api.get('/users/suggestions');
        setSuggestions(res.data.users);
      } catch {
        // Silently fail — suggestions are optional
      }
    };
    loadSuggestions();
  }, []);

  // Build a map of who we're following for quick lookup
  useEffect(() => {
    if (currentUser?.following) {
      const map = {};
      currentUser.following.forEach((id) => {
        const userId = typeof id === 'object' ? id._id : id;
        map[userId] = true;
      });
      setFollowingMap(map);
    }
  }, [currentUser]);

  // Search users
  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await api.get(`/users/search?q=${encodeURIComponent(query.trim())}`);
      setResults(res.data.users);
    } catch {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Follow / Unfollow from search results
  const handleFollow = async (userId) => {
    try {
      const res = await api.put(`/users/follow/${userId}`);
      setFollowingMap((prev) => ({
        ...prev,
        [userId]: res.data.isFollowing,
      }));
      toast.success(res.data.message);
    } catch {
      toast.error('Failed to update follow status');
    }
  };

  // Render a single user card
  const UserCard = ({ userItem }) => {
    const isFollowing = followingMap[userItem._id];

    return (
      <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
        <Link
          to={`/profile/${userItem.username}`}
          className="flex items-center gap-3 flex-1 min-w-0"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center shrink-0 shadow-md shadow-primary-500/15">
            {userItem.profilePicture ? (
              <img
                src={`http://localhost:5000${userItem.profilePicture}`}
                alt={userItem.username}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-lg">
                {(userItem.username?.[0] || 'U').toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-gray-900 dark:text-white text-[15px] truncate">
              {userItem.fullName || userItem.username}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              @{userItem.username}
            </p>
            {userItem.bio && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                {userItem.bio}
              </p>
            )}
          </div>
        </Link>

        {userItem._id !== currentUser?._id && (
          <button
            onClick={() => handleFollow(userItem._id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shrink-0 ml-3 ${
              isFollowing
                ? 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400'
                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-500/20'
            }`}
          >
            {isFollowing ? (
              <>
                <HiOutlineUserRemove className="text-base" />
                <span className="hidden sm:inline">Unfollow</span>
              </>
            ) : (
              <>
                <HiOutlineUserAdd className="text-base" />
                <span className="hidden sm:inline">Follow</span>
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* ===== Search Bar ===== */}
        <div className="card mb-6">
          <form onSubmit={handleSearch} className="relative">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people by name or username..."
              className="input-field pl-12 pr-20"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                  setSearched(false);
                }}
                className="absolute right-14 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <HiOutlineX className="text-lg" />
              </button>
            )}
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-40"
            >
              {loading ? '...' : 'Search'}
            </button>
          </form>
        </div>

        {/* ===== Search Results ===== */}
        {searched && (
          <div className="card mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HiOutlineSearch className="text-primary-500" />
              Results for &ldquo;{query}&rdquo;
              <span className="text-sm font-normal text-gray-400 ml-1">
                ({results.length} found)
              </span>
            </h3>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse p-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-gray-500 dark:text-gray-400">
                  No users found matching &ldquo;{query}&rdquo;
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {results.map((userItem) => (
                  <UserCard key={userItem._id} userItem={userItem} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== Suggestions (shown when no search is active) ===== */}
        {!searched && suggestions.length > 0 && (
          <div className="card">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-xl">✨</span>
              People you might know
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {suggestions.map((userItem) => (
                <UserCard key={userItem._id} userItem={userItem} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state when no suggestions */}
        {!searched && suggestions.length === 0 && (
          <div className="card text-center py-12">
            <div className="text-5xl mb-3">🌐</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              Find people
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Search for friends, colleagues, or interesting people to follow.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
