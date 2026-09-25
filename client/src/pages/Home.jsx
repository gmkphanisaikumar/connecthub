import { useState, useEffect, useCallback } from 'react';
import Layout from '../components/layout/Layout';
import CreatePost from '../components/PostCard/CreatePost';
import PostCard from '../components/PostCard/PostCard';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch posts from the API
  const fetchPosts = useCallback(async (pageNum = 1) => {
    try {
      const res = await api.get(`/posts/feed?page=${pageNum}&limit=10`);
      const { posts: newPosts, pagination } = res.data;

      if (pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }

      setHasMore(pageNum < pagination.pages);
    } catch {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Load posts on first render
  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  // Load more posts (pagination)
  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  // When a new post is created, add it to the top of the feed
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // When a post is edited, update it in the feed
  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  // When a post is deleted, remove it from the feed
  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Create Post Box */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Posts Feed */}
        {loading ? (
          // Loading skeleton
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-32 mb-2" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-20" />
                  </div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-full mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-4" />
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          // Empty state
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No posts yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Be the first to share something! Create your first post above.
            </p>
          </div>
        ) : (
          // Post list
          <>
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onPostUpdated={handlePostUpdated}
                onPostDeleted={handlePostDeleted}
              />
            ))}

            {/* Load More button */}
            {hasMore && (
              <div className="text-center py-6">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="btn-secondary text-sm"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    'Load More Posts'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Home;
