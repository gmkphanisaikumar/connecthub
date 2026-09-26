import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import api, { getImageUrl } from '../utils/api';
import toast from 'react-hot-toast';
import {
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineShieldCheck,
  HiOutlineBell,
  HiOutlinePhotograph,
  HiOutlineCheck,
} from 'react-icons/hi';

const Settings = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  // Dark mode state — read from localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Sync profileForm when user loads
  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Notification preferences
  const [notifPrefs, setNotifPrefs] = useState({
    likes: true,
    comments: true,
    follows: true,
  });

  // Apply dark mode to <html> element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  // Update Profile & Avatar Handler
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const formData = new FormData();
      formData.append('fullName', profileForm.fullName.trim());
      formData.append('bio', profileForm.bio.trim());
      if (avatarFile) {
        formData.append('profilePicture', avatarFile);
      }

      const res = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setAvatarFile(null);
      setAvatarPreview(null);
      toast.success('Profile & picture updated successfully! ✨');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);
    try {
      await api.put('/users/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully! 🔐');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings & Profile
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your account settings, avatar, preferences, and security.
          </p>
        </div>

        {/* ===== Profile & Avatar Card ===== */}
        <div className="card border border-gray-100 dark:border-gray-800 shadow-sm rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 rounded-xl flex items-center justify-center">
              <HiOutlineUser className="text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">
                Profile & Avatar
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Update your public photo, name, and bio
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            {/* Avatar Preview & Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-gray-50/80 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-400 via-cyan-500 to-emerald-400 rounded-full flex items-center justify-center overflow-hidden shadow-md ring-4 ring-white dark:ring-gray-800 shrink-0">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="New Avatar"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : user?.profilePicture ? (
                  <img
                    src={getImageUrl(user.profilePicture)}
                    alt="Current Avatar"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-2xl">
                    {(user?.username?.[0] || 'U').toUpperCase()}
                  </span>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-700 shadow-xs transition-colors">
                  <HiOutlinePhotograph className="text-base" />
                  <span>{avatarPreview ? 'Change Selected Photo' : 'Upload New Photo'}</span>
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
                        setAvatarFile(file);
                        setAvatarPreview(URL.createObjectURL(file));
                        toast.success('Photo chosen! Click Save Profile to apply.');
                      }
                    }}
                  />
                </label>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  JPG, PNG, GIF, WebP up to 10MB
                </p>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={profileForm.fullName}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, fullName: e.target.value })
                }
                className="input-field text-sm"
                placeholder="Enter your full name"
                maxLength={50}
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Bio / Headline
              </label>
              <textarea
                value={profileForm.bio}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, bio: e.target.value })
                }
                className="input-field text-sm"
                rows={2}
                placeholder="A short bio about yourself..."
                maxLength={200}
              />
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="btn-primary text-xs sm:text-sm px-6 py-2.5 font-semibold flex items-center gap-2 shadow-md"
            >
              {profileLoading ? (
                <span>Saving Profile...</span>
              ) : (
                <>
                  <HiOutlineCheck className="text-base" />
                  <span>Save Profile & Photo</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* ===== Appearance ===== */}
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center">
              {darkMode ? (
                <HiOutlineMoon className="text-cyan-600 dark:text-cyan-400 text-xl" />
              ) : (
                <HiOutlineSun className="text-amber-500 text-xl" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Appearance</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Customize how ConnectHub looks
              </p>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <HiOutlineMoon className="text-xl text-gray-600 dark:text-gray-300" />
              ) : (
                <HiOutlineSun className="text-xl text-amber-500" />
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Dark Mode
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {darkMode ? 'Currently using dark theme' : 'Currently using light theme'}
                </p>
              </div>
            </div>

            {/* Toggle switch */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 ${
                darkMode ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                  darkMode ? 'translate-x-7' : 'translate-x-0'
                }`}
              >
                {darkMode ? (
                  <HiOutlineMoon className="text-primary-600 text-xs" />
                ) : (
                  <HiOutlineSun className="text-amber-500 text-xs" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* ===== Notifications ===== */}
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <HiOutlineBell className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose what to be notified about
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { key: 'likes', label: 'Likes', desc: 'When someone likes your post' },
              { key: 'comments', label: 'Comments', desc: 'When someone comments on your post' },
              { key: 'follows', label: 'New Followers', desc: 'When someone follows you' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
                <button
                  onClick={() =>
                    setNotifPrefs((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    notifPrefs[item.key] ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                      notifPrefs[item.key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Change Password ===== */}
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <HiOutlineLockClosed className="text-green-600 dark:text-green-400 text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Security</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Change your password
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            {[
              { name: 'currentPassword', label: 'Current Password', placeholder: 'Enter current password' },
              { name: 'newPassword', label: 'New Password', placeholder: 'At least 6 characters' },
              { name: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Re-enter new password' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {field.label}
                </label>
                <input
                  type="password"
                  value={passwordForm[field.name]}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, [field.name]: e.target.value })
                  }
                  placeholder={field.placeholder}
                  className="input-field"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={passwordLoading}
              className="btn-primary flex items-center gap-2"
            >
              {passwordLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Changing...
                </>
              ) : (
                <>
                  <HiOutlineShieldCheck className="text-lg" />
                  Change Password
                </>
              )}
            </button>
          </form>
        </div>

        {/* ===== Logout ===== */}
        <div className="card border-red-100 dark:border-red-900/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                Sign Out
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Sign out of your ConnectHub account
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-semibold text-sm"
            >
              <HiOutlineLogout className="text-lg" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;

