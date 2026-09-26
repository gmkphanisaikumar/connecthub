import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import PostCard from '../components/PostCard/PostCard';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { HiOutlineFire, HiOutlineSparkles, HiOutlineRefresh } from 'react-icons/hi';

const Trending = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTrendingPosts = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await api.get('/posts/trending');
      setPosts(res.data.posts || []);
    } catch (error) {
      toast.error('Failed to load trending posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTrendingPosts();
  }, []);

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((p) => p._id !== postId));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8 justify-center">
          {/* Main Feed Column */}
          <div className="w-full max-w-2xl">
            {/* Trending Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-cyan-800 to-teal-800 text-white p-6 sm:p-8 mb-6 shadow-xl shadow-cyan-900/10 border border-cyan-700/30">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="p-2 bg-white/10 backdrop-blur-md rounded-xl text-amber-300">
                      <HiOutlineFire className="text-2xl animate-pulse" />
                    </span>
                    <span className="text-xs uppercase font-bold tracking-widest text-cyan-300">
                      Top Engagement
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Trending on ConnectHub
                  </h1>
                  <p className="text-cyan-100/90 text-sm mt-1.5 max-w-md">
                    Posts ranked by highest real-time interactions, likes, comments, and shares across the network.
                  </p>
                </div>

                <button
                  onClick={() => fetchTrendingPosts(true)}
                  disabled={refreshing}
                  className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md rounded-2xl text-sm font-medium transition-all"
                  title="Refresh Trending"
                >
                  <HiOutlineRefresh className={`text-lg ${refreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Content Section */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="card animate-pulse space-y-4 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-gray-200 dark:bg-gray-800 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
                      </div>
                    </div>
                    <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="card text-center py-16 px-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-cyan-500/20 to-teal-500/20 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center">
                  <HiOutlineSparkles className="text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  No Trending Posts Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5 max-w-sm mx-auto">
                  Be the first to create high-engagement content! Like, comment, and share posts to see them trend here.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post, idx) => (
                  <div key={post._id} className="relative">
                    {/* Ranking Tag */}
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        idx === 0
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/20'
                          : idx === 1
                          ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-cyan-500/20'
                          : idx === 2
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-blue-500/20'
                          : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}>
                        <span>{idx === 0 ? '🔥 #1 Trending' : idx === 1 ? '⚡ #2 Top Engaged' : idx === 2 ? '✨ #3 Popular' : `#${idx + 1} Trending`}</span>
                      </span>
                    </div>

                    <PostCard
                      post={post}
                      onPostUpdated={handlePostUpdated}
                      onPostDeleted={handlePostDeleted}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <Sidebar />
        </div>
      </main>
    </div>
  );
};

export default Trending;
