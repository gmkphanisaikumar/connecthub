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
  const [editCover, setEditCover] = useState(null);
  const [editCoverPreview, setEditCoverPreview] = useState(null);
  const [removeCover, setRemoveCover] = useState(false);
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
        const isFollow = res.data.user.followers?.some(
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

  // Direct cover file change from banner
  const handleDirectCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Cover image must be less than 10MB');
      return;
    }

    const toastId = toast.loading('Uploading cover background...');
    try {
      const formData = new FormData();
      formData.append('coverPicture', file);

      const res = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updatedUser = res.data.user;
      setProfileUser(updatedUser);
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Cover image updated! 🌅', { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload cover image', { id: toastId });
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
      if (editCover) {
        formData.append('coverPicture', editCover);
      }
      if (removeCover) {
        formData.append('removeCover', 'true');
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
      setEditCover(null);
      setEditCoverPreview(null);
      setRemoveCover(false);
      toast.success('Profile updated successfully! ✨');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
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
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
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
        <div className="card mb-6 p-0 overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm rounded-3xl relative">
          {/* Cover Photo / Background Area */}
          <div className="h-48 sm:h-56 w-full relative overflow-hidden bg-gradient-to-br from-blue-950 via-cyan-900 to-teal-900">
            {profileUser.coverPicture ? (
              <img
                src={getImageUrl(profileUser.coverPicture)}
                alt={`${profileUser.username}'s Cover`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full relative">
                {/* Decorative gradients if no cover photo */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-cyan-800/90 to-teal-800/90" />
                <div className="absolute top-6 right-8 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl" />
                <div className="absolute bottom-4 left-12 w-48 h-48 bg-teal-300/20 rounded-full blur-3xl" />
              </div>
            )}

            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

            {/* Banner Quick Cover Change Button (Owner only) */}
            {isOwnProfile && (
              <div className="absolute top-3.5 right-3.5 z-10">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/50 hover:bg-black/75 active:bg-black/90 backdrop-blur-md text-white rounded-xl text-xs font-semibold border border-white/20 shadow-lg transition-all">
                  <HiOutlinePhotograph className="text-base text-cyan-300" />
                  <span className="hidden sm:inline">
                    {profileUser.coverPicture ? 'Change Cover' : 'Add Cover Photo'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleDirectCoverChange}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            {/* Avatar + Actions row */}
            <div className="flex items-end justify-between -mt-14 mb-4 relative z-10">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowEditModal(false)}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-7 border border-gray-200 dark:border-gray-800 my-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-5">
                Edit Profile & Media
              </h3>

              <form onSubmit={handleUpdateProfile} className="space-y-5">
                {/* 1. Cover / Background Image Upload */}
                <div className="p-4 bg-gray-50/80 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      Cover Background Image
                    </label>
                    {(editCoverPreview || (profileUser.coverPicture && !removeCover)) && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditCover(null);
                          setEditCoverPreview(null);
                          setRemoveCover(true);
                        }}
                        className="text-xs text-red-500 hover:text-red-600 font-semibold"
                      >
                        Remove Cover
                      </button>
                    )}
                  </div>

                  <div className="h-28 w-full rounded-xl overflow-hidden mb-3 border border-gray-200 dark:border-gray-700 bg-gray-950 flex items-center justify-center relative">
                    {editCoverPreview ? (
                      <img
                        src={editCoverPreview}
                        alt="New Cover Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : profileUser.coverPicture && !removeCover ? (
                      <img
                        src={getImageUrl(profileUser.coverPicture)}
                        alt="Current Cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-blue-900 via-cyan-800 to-teal-800 flex items-center justify-center text-xs text-cyan-200 font-medium">
                        Default Gradient (No image uploaded)
                      </div>
                    )}
                  </div>

                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-700 shadow-xs transition-colors">
                    <HiOutlinePhotograph className="text-base" />
                    <span>{editCoverPreview ? 'Change Cover File' : 'Upload Cover Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 10 * 1024 * 1024) {
                            toast.error('Cover must be less than 10MB');
                            return;
                          }
                          setEditCover(file);
                          setEditCoverPreview(URL.createObjectURL(file));
                          setRemoveCover(false);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* 2. Profile Picture Upload */}
                <div className="flex flex-col items-center p-4 bg-gray-50/80 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <div className="relative mb-3">
                    <div className="w-20 h-20 bg-gradient-to-br from-teal-400 via-cyan-500 to-emerald-400 rounded-full flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white dark:ring-gray-800">
                      {editPreview ? (
                        <img
                          src={editPreview}
                          alt="New Avatar Preview"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : profileUser.profilePicture ? (
                        <img
                          src={getImageUrl(profileUser.profilePicture)}
                          alt="Profile Avatar"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-2xl">
                          {(profileUser.username?.[0] || 'U').toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Direct Select File Button */}
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-700 shadow-xs transition-colors">
                    <HiOutlinePhotograph className="text-base" />
                    <span>{editPreview ? 'Change Selected Photo' : 'Upload Avatar Photo'}</span>
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
                          toast.success('Avatar selected!');
                        }
                      }}
                    />
                  </label>
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
                      setEditCover(null);
                      setEditCoverPreview(null);
                      setRemoveCover(false);
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


