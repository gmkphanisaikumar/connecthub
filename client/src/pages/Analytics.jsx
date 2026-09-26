import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import api, { getImageUrl } from '../utils/api';
import toast from 'react-hot-toast';
import {
  HiOutlineTrendingUp,
  HiOutlineHeart,
  HiOutlineChatAlt,
  HiOutlineShare,
  HiOutlineBookmark,
  HiOutlineDocumentText,
  HiOutlineUserGroup,
  HiOutlineChartBar,
  HiOutlineSparkles,
} from 'react-icons/hi';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/posts/analytics');
      setAnalytics(res.data.analytics);
    } catch (error) {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8 justify-center">
          {/* Main Analytics Content */}
          <div className="w-full max-w-3xl space-y-6">
            {/* Analytics Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-cyan-900 to-teal-900 text-white p-6 sm:p-8 shadow-xl shadow-cyan-950/15 border border-cyan-700/30">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="p-2 bg-white/10 backdrop-blur-md rounded-xl text-teal-300">
                      <HiOutlineTrendingUp className="text-2xl" />
                    </span>
                    <span className="text-xs uppercase font-bold tracking-widest text-cyan-300">
                      Performance Dashboard
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Real-Time Activity Analytics
                  </h1>
                  <p className="text-cyan-100/90 text-sm mt-1.5 max-w-lg">
                    Real metrics powered by your authentic database records — tracking engagement, reaches, and audience interactions.
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-2xl text-xs font-semibold backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Live Database Synced</span>
                </div>
              </div>
            </div>

            {loading ? (
              /* Loading Skeleton */
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="card p-5 animate-pulse bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-3"
                    >
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              </div>
            ) : !analytics ? (
              <div className="card text-center py-16 px-6 bg-white dark:bg-gray-900 rounded-3xl">
                <p className="text-gray-500">No analytics data available.</p>
              </div>
            ) : (
              <>
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {/* Total Posts */}
                  <div className="card p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
                        <HiOutlineDocumentText className="text-xl" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Posts
                      </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                      {analytics.totalPosts}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total published</p>
                  </div>

                  {/* Total Likes */}
                  <div className="card p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 bg-red-50 dark:bg-red-950/50 text-red-500 rounded-xl">
                        <HiOutlineHeart className="text-xl" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Likes
                      </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                      {analytics.totalLikes}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Reactions received</p>
                  </div>

                  {/* Total Comments */}
                  <div className="card p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 rounded-xl">
                        <HiOutlineChatAlt className="text-xl" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Comments
                      </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                      {analytics.totalComments}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Conversations started</p>
                  </div>

                  {/* Total Shares */}
                  <div className="card p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 rounded-xl">
                        <HiOutlineShare className="text-xl" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Shares
                      </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                      {analytics.totalShares}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Times shared</p>
                  </div>

                  {/* Total Bookmarks */}
                  <div className="card p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 text-amber-500 rounded-xl">
                        <HiOutlineBookmark className="text-xl" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Saved
                      </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                      {analytics.totalSaved}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Bookmarked items</p>
                  </div>

                  {/* Total Followers */}
                  <div className="card p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
                        <HiOutlineUserGroup className="text-xl" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Audience
                      </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                      {analytics.followersCount}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Followers connected</p>
                  </div>
                </div>

                {/* Engagement Overview Card */}
                <div className="card p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-br from-cyan-500 to-teal-500 text-white rounded-xl shadow-md shadow-cyan-500/20">
                        <HiOutlineChartBar className="text-xl" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">
                          Engagement Health
                        </h3>
                        <p className="text-xs text-gray-400">Network interaction distribution</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-teal-600 dark:text-teal-400">
                        {analytics.avgInteractionsPerPost}
                      </div>
                      <div className="text-[11px] text-gray-400">Avg Interactions / Post</div>
                    </div>
                  </div>

                  {/* Distribution Progress Bars */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-red-500">Likes Share</span>
                        <span className="text-gray-600 dark:text-gray-300">
                          {analytics.totalInteractions > 0
                            ? Math.round((analytics.totalLikes / analytics.totalInteractions) * 100)
                            : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-red-500 h-2.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              analytics.totalInteractions > 0
                                ? (analytics.totalLikes / analytics.totalInteractions) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-teal-600 dark:text-teal-400">Comments Share</span>
                        <span className="text-gray-600 dark:text-gray-300">
                          {analytics.totalInteractions > 0
                            ? Math.round((analytics.totalComments / analytics.totalInteractions) * 100)
                            : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-teal-500 h-2.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              analytics.totalInteractions > 0
                                ? (analytics.totalComments / analytics.totalInteractions) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-cyan-600 dark:text-cyan-400">Shares Share</span>
                        <span className="text-gray-600 dark:text-gray-300">
                          {analytics.totalInteractions > 0
                            ? Math.round((analytics.totalShares / analytics.totalInteractions) * 100)
                            : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              analytics.totalInteractions > 0
                                ? (analytics.totalShares / analytics.totalInteractions) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Most Engaged Posts Section */}
                <div className="card p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="p-2 bg-amber-50 dark:bg-amber-950/50 text-amber-500 rounded-xl">
                      <HiOutlineSparkles className="text-xl" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        Your Most-Engaged Content
                      </h3>
                      <p className="text-xs text-gray-400">Top performing posts ranked by community activity</p>
                    </div>
                  </div>

                  {analytics.mostEngagedPosts?.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">
                      You haven't posted anything yet. Share your first post to see real metrics!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {analytics.mostEngagedPosts.map((post, index) => (
                        <div
                          key={post._id}
                          className="flex items-center justify-between p-4 bg-gray-50/80 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors gap-4"
                        >
                          <div className="flex items-center gap-3.5 flex-1 min-w-0">
                            <span className="font-black text-sm text-cyan-600 dark:text-cyan-400 w-5">
                              #{index + 1}
                            </span>
                            {post.image && (
                              <img
                                src={getImageUrl(post.image)}
                                alt="Post thumbnail"
                                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-200 dark:border-gray-700"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {post.text || '(Image post)'}
                              </p>
                              <span className="text-xs text-gray-400">
                                {formatDate(post.createdAt)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-xs shrink-0">
                            <span className="flex items-center gap-1 font-semibold text-red-500">
                              ♥ {post.likes?.length || 0}
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-teal-600 dark:text-teal-400">
                              💬 {post.comments?.length || 0}
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-cyan-600 dark:text-cyan-400">
                              🔗 {post.shares?.length || 0}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Activity Stream */}
                <div className="card p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                    Recent Post Activity Log
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">Historical timeline of your latest posts and interactions</p>

                  {analytics.recentActivity?.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">
                      No recent activity recorded.
                    </p>
                  ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                      {analytics.recentActivity.map((activity) => (
                        <div key={activity._id} className="py-3 flex items-center justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-gray-800 dark:text-gray-200 truncate font-medium">
                              {activity.text || '(Image Upload)'}
                            </p>
                            <span className="text-xs text-gray-400">
                              {formatDate(activity.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 shrink-0">
                            <span>{activity.likesCount} likes</span>
                            <span>·</span>
                            <span>{activity.commentsCount} comments</span>
                            <span>·</span>
                            <span>{activity.sharesCount} shares</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Sidebar */}
          <Sidebar />
        </div>
      </main>
    </div>
  );
};

export default Analytics;
