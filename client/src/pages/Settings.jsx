import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineShieldCheck,
  HiOutlineBell,
} from 'react-icons/hi';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Dark mode state — read from localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

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
      // We will add this endpoint in a future step
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h2>

        {/* ===== Appearance ===== */}
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              {darkMode ? (
                <HiOutlineMoon className="text-purple-600 dark:text-purple-400 text-xl" />
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

        {/* ===== Account Info ===== */}
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
              <HiOutlineUser className="text-primary-600 dark:text-primary-400 text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Account</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your account information
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Username', value: `@${user?.username}` },
              { label: 'Email', value: user?.email },
              { label: 'Full Name', value: user?.fullName || '—' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {item.label}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.value}
                </span>
              </div>
            ))}
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
