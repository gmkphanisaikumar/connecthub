import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import PostCard from '../components/PostCard/PostCard';
import api, { getImageUrl } from '../utils/api';
import toast from 'react-hot-toast';
import {
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlinePencil,
  HiOutlineUserAdd,
  HiOutlineUserRemove,
  HiOutlinePhotograph,
} from 'react-icons/hi';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser, setUser: setCurrentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  // Edit profile modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: '', bio: '' });
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const isOwnProfile = currentUser?.username === username;

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/users/profile/${username}`);
        setProfileUser(res.data.user);
        setPosts(res.data.posts);

        // Check if we're following this user
        const isFollow = res.data.user.followers.some(
          (f) => (f._id || f) === currentUser?._id
        );
        setIsFollowing(isFollow);

        // Populate edit form with current data
        setEditForm({
          fullName: res.data.user.fullName || '',
          bio: res.data.user.bio || '',
        });
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchProfile();
  }, [username, currentUser?._id]);

  // Follow / Unfollow
  const handleFollow = async () => {
    if (followLoading) return;
    setFollowLoading(true);
    try {
      const res = await api.put(`/users/follow/${profileUser._id}`);
      setIsFollowing(res.data.isFollowing);

      // Update the follower count locally
      setProfileUser((prev) => ({
        ...prev,
        followers: res.data.isFollowing
          ? [...prev.followers, { _id: currentUser._id }]
          : prev.followers.filter((f) => (f._id || f) !== currentUser._id),
      }));

      toast.success(res.data.message);
    } catch {
      toast.error('Failed to update follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const formData = new FormData();
      formData.append('fullName', editForm.fullName.trim());
      formData.append('bio', editForm.bio.trim());
      if (editImage) {
        formData.append('profilePicture', editImage);
      }

      const res = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updatedUser = res.data.user;
      setProfileUser(updatedUser);
      setCurrentUser(updatedUser); // Update global auth state too
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setShowEditModal(false);
      setEditImage(null);
      setEditPreview(null);
      toast.success('Profile & photo updated successfully! ✨');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile picture');
    } finally {
      setEditLoading(false);
    }
  };

  // Handle post updates/deletes from PostCard
  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  // Format join date
  const formatJoinDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <div className="card animate-pulse">
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
            <div className="flex items-end gap-4 -mt-16 ml-6 mb-4">
              <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full border-4 border-white dark:border-gray-900" />
              <div className="mb-2">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profileUser) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <div className="card text-center py-16">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              User not found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              The user @{username} doesn&apos;t exist.
            </p>
            <Link to="/" className="btn-primary">Go Home</Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* ===== Profile Header Card ===== */}
        <div className="card mb-6 p-0 overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm rounded-3xl">
          {/* Cover Photo */}
          <div className="h-44 bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-800 relative">
            <div className="absolute inset-0 bg-black/10" />
            {/* Decorative pattern */}
            <div className="absolute top-6 right-8 w-32 h-32 bg-cyan-400/15 rounded-full blur-2xl" />
            <div className="absolute bottom-4 left-12 w-48 h-48 bg-teal-300/15 rounded-full blur-3xl" />
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            {/* Avatar + Actions row */}
            <div className="flex items-end justify-between -mt-14 mb-4">
              <div className="w-28 h-28 bg-gradient-to-br from-teal-400 via-cyan-500 to-emerald-400 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center shadow-xl shadow-cyan-500/20 overflow-hidden ring-2 ring-cyan-400/30 shrink-0">
                {profileUser.profilePicture ? (
                  <img
                    src={getImageUrl(profileUser.profilePicture)}
                    alt={profileUser.username}
                    className="w-28 h-28 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-4xl">
                    {(profileUser.username?.[0] || 'U').toUpperCase()}
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-16">
                {isOwnProfile ? (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="btn-secondary flex items-center gap-2 text-sm font-semibold shadow-xs"
                  >
                    <HiOutlinePencil className="text-lg text-cyan-600 dark:text-cyan-400" />
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={handleFollow}
                    disabled={followLoading}
                    className={`flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] ${
                      isFollowing
                        ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-500 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400'
                        : 'btn-primary'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <HiOutlineUserRemove className="text-lg" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <HiOutlineUserAdd className="text-lg" />
                        Follow
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Name & username */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {profileUser.fullName || profileUser.username}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-0.5">
              @{profileUser.username}
            </p>

            {/* Bio */}
            {profileUser.bio && (
              <p className="text-gray-700 dark:text-gray-300 mt-3 text-[15px] leading-relaxed">
                {profileUser.bio}
              </p>
            )}

            {/* Meta info */}
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <HiOutlineCalendar className="text-lg" />
                Joined {formatJoinDate(profileUser.createdAt)}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-900 dark:text-white">
                  {posts.length}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  Posts
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-900 dark:text-white">
                  {profileUser.followers?.length || 0}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  Followers
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-900 dark:text-white">
                  {profileUser.following?.length || 0}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  Following
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Tabs ===== */}
        <div className="card mb-6 p-0">
          <div className="flex border-b border-gray-100 dark:border-gray-800">
            {['posts', 'likes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-semibold capitalize transition-colors relative ${
                  activeTab === tab
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ===== Posts List ===== */}
        {posts.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-3">📭</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              No posts yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {isOwnProfile
                ? 'Share your first post from the home page!'
                : `@${profileUser.username} hasn't posted anything yet.`}
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onPostUpdated={handlePostUpdated}
              onPostDeleted={handlePostDeleted}
            />
          ))
        )}

        {/* ===== Edit Profile Modal ===== */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowEditModal(false)}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-7 border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-5">
                Edit Profile & Avatar
              </h3>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center p-4 bg-gray-50/80 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <div className="relative mb-3">
                    <div className="w-24 h-24 bg-gradient-to-br from-teal-400 via-cyan-500 to-emerald-400 rounded-full flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white dark:ring-gray-800">
                      {editPreview ? (
                        <img
                          src={editPreview}
                          alt="New Avatar Preview"
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : profileUser.profilePicture ? (
                        <img
                          src={getImageUrl(profileUser.profilePicture)}
                          alt="Profile Avatar"
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-3xl">
                          {(profileUser.username?.[0] || 'U').toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Direct Select File Button */}
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-700 shadow-xs transition-colors">
                    <HiOutlinePhotograph className="text-base" />
                    <span>{editPreview ? 'Change Selected Photo' : 'Upload New Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 10 * 1024 * 1024) {
                            toast.error('Image must be less than 10MB');
                            return;
                          }
                          setEditImage(file);
                          setEditPreview(URL.createObjectURL(file));
                          toast.success('Photo selected! Click Save Changes to apply.');
                        }
                      }}
                    />
                  </label>
                  <p className="text-[11px] text-gray-400 mt-2">
                    Supports JPG, PNG, GIF, WebP (Max 10MB)
                  </p>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, fullName: e.target.value })
                    }
                    className="input-field text-sm"
                    maxLength={50}
                    placeholder="Your full name"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Bio / Status
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) =>
                      setEditForm({ ...editForm, bio: e.target.value })
                    }
                    className="input-field text-sm"
                    rows={3}
                    maxLength={200}
                    placeholder="Tell people about yourself..."
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {editForm.bio.length}/200
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditImage(null);
                      setEditPreview(null);
                    }}
                    className="btn-secondary flex-1 py-2.5 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="btn-primary flex-1 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 shadow-md"
                  >
                    {editLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;

