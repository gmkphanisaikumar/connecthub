import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineIdentification,
} from 'react-icons/hi';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      await register({
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      toast.success('Account created! Welcome to ConnectHub! 🎉');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ===== Left Side: Branding Panel ===== */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-700 via-primary-700 to-primary-600 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-primary-300/20 rounded-full blur-xl" />

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-2xl">
              <span className="text-4xl font-bold">C</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-center">
              Connect<span className="text-primary-200">Hub</span>
            </h1>
          </div>
          <p className="text-xl text-primary-100 text-center max-w-md leading-relaxed">
            Join thousands of people sharing ideas, stories, and connections.
          </p>

          {/* Features list */}
          <div className="mt-12 space-y-4 text-primary-100">
            {[
              '🚀 Share posts with photos and videos',
              '💬 Real-time chat with friends',
              '🔔 Stay updated with notifications',
              '🌙 Beautiful dark mode support',
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-lg">
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Right Side: Register Form ===== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-950">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-6">
            <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25">
              <span className="text-2xl font-bold text-white">C</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Connect<span className="text-primary-600">Hub</span>
            </h1>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <Link
              to="/landing"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline mb-2"
            >
              ← Back to Landing Showcase
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create your account
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Start your journey with ConnectHub
            </p>
          </div>

          {/* Register form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <HiOutlineIdentification className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="input-field pl-12"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Username <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="input-field pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <HiOutlineEyeOff className="text-xl" /> : <HiOutlineEye className="text-xl" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
