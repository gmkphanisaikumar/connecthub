import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import PostCard from '../components/PostCard/PostCard';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { HiOutlineBookmark, HiOutlineSparkles, HiOutlineArrowLeft } from 'react-icons/hi';

const SavedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedPosts = async () => {
    try {
      const res = await api.get('/posts/saved');
      setPosts(res.data.posts || []);
    } catch (error) {
      toast.error('Failed to load saved posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPosts();
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
          {/* Main Content Column */}
          <div className="w-full max-w-2xl">
            {/* Saved Posts Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-cyan-900 to-blue-950 text-white p-6 sm:p-8 mb-6 shadow-xl shadow-teal-900/10 border border-teal-700/30">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-teal-400/20 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="p-2 bg-white/10 backdrop-blur-md rounded-xl text-amber-300">
                      <HiOutlineBookmark className="text-2xl" />
                    </span>
                    <span className="text-xs uppercase font-bold tracking-widest text-teal-300">
                      Private Collection
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Saved Posts
                  </h1>
                  <p className="text-teal-100/90 text-sm mt-1.5 max-w-md">
                    All your bookmarked posts, resources, and inspirations saved securely in one place.
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-3xl font-black text-white">{posts.length}</span>
                  <span className="text-xs text-teal-200">Total Saved</span>
                </div>
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
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-amber-500/20 to-teal-500/20 text-amber-500 rounded-2xl flex items-center justify-center">
                  <HiOutlineBookmark className="text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  No Saved Posts Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5 max-w-sm mx-auto mb-6">
                  Whenever you see a post you want to revisit later, click the bookmark icon to save it here.
                </p>
                <Link
                  to="/home"
                  className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl font-semibold text-sm shadow-md"
                >
                  <HiOutlineArrowLeft className="text-lg" />
                  <span>Explore Feed</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onPostUpdated={handlePostUpdated}
                    onPostDeleted={handlePostDeleted}
                  />
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

export default SavedPosts;
