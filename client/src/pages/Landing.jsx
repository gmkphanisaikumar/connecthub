import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineChatAlt2,
  HiOutlineHeart,
  HiOutlineBell,
  HiOutlineSearch,
  HiOutlineUserGroup,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineLightningBolt,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineChevronDown,
  HiOutlinePhotograph,
  HiOutlineThumbUp,
  HiOutlineAnnotation,
  HiOutlinePaperAirplane,
  HiOutlineGlobeAlt,
  HiOutlineDeviceMobile,
  HiOutlineBookmark,
  HiOutlineUserAdd,
  HiOutlineEye,
} from 'react-icons/hi';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Active tab in the interactive feature playground
  const [activeTab, setActiveTab] = useState('chat');

  // Interactive demo states
  const [demoLiked, setDemoLiked] = useState(false);
  const [demoLikesCount, setDemoLikesCount] = useState(142);
  const [demoChatMessages, setDemoChatMessages] = useState([
    { id: 1, sender: 'alex', text: 'Hey there! Have you checked out the new travel photos I posted? 📸', time: 'Just now' },
    { id: 2, sender: 'me', text: 'Just saw them! That sunset shot looks incredible! 🌅✨', time: 'Just now' },
  ]);
  const [demoInputText, setDemoInputText] = useState('');
  const [demoNotifCount, setDemoNotifCount] = useState(3);
  const [activeFaq, setActiveFaq] = useState(null);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const handleDemoLike = () => {
    if (demoLiked) {
      setDemoLikesCount((prev) => prev - 1);
      setDemoLiked(false);
    } else {
      setDemoLikesCount((prev) => prev + 1);
      setDemoLiked(true);
    }
  };

  const handleSendDemoMessage = (e) => {
    e.preventDefault();
    if (!demoInputText.trim()) return;
    setDemoChatMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'me',
        text: demoInputText.trim(),
        time: 'Just now',
      },
    ]);
    setDemoInputText('');
  };

  const faqItems = [
    {
      q: 'What is ConnectHub?',
      a: 'ConnectHub is a modern social platform designed to bring people together. Share multimedia posts, engage in rich discussions, chat in real time with friends, and discover vibrant communities with zero clutter.',
    },
    {
      q: 'Is ConnectHub free to use?',
      a: 'Yes, ConnectHub is 100% free to join. You can create your profile, connect with friends, publish posts, and chat instantly without any subscription fees or paywalls.',
    },
    {
      q: 'How does real-time chat and direct messaging work?',
      a: 'Our direct messaging enables instant one-on-one conversations. Messages and typing updates are delivered immediately with live online presence badges, so you never miss a message from your friends.',
    },
    {
      q: 'Can I use ConnectHub on my phone or tablet?',
      a: 'Absolutely! ConnectHub is fully responsive and tailored for mobile phones, tablets, and desktop computers. You get a fast, seamless experience on every device.',
    },
    {
      q: 'How do notifications work?',
      a: 'You receive instant alerts whenever someone likes your post, writes a comment, sends you a private chat message, or follows your profile.',
    },
    {
      q: 'How is my account and privacy secured?',
      a: 'Your account is protected with encrypted authentication and industry-standard security practices. Your personal credentials and messages are safeguarded at every step.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 selection:bg-teal-500 selection:text-white">
      
      {/* ============================================================ */}
      {/* 1. TOP NAVBAR / HEADER                                       */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-teal-500 via-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-extrabold text-xl tracking-tight">C</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Connect<span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-500">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
            <a href="#features" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">How It Works</a>
            <a href="#interactive-demo" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Interactive Demo</a>
            <a href="#community" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Community</a>
            <a href="#faq" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">FAQ</a>
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-3">
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {darkMode ? <HiOutlineSun className="w-5 h-5 text-amber-400" /> : <HiOutlineMoon className="w-5 h-5 text-cyan-600" />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/home"
                className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Go to Feed</span>
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 text-white px-4 sm:px-5 py-2 rounded-xl text-sm font-semibold shadow-md shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Get Started Free</span>
                  <HiOutlineSparkles className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. HERO SECTION                                              */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-teal-500/20 dark:bg-teal-600/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[300px] bg-cyan-500/20 dark:bg-cyan-600/15 rounded-full blur-3xl pointer-events-none -z-10 animate-float" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Floating Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 shadow-sm animate-float">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>ConnectHub • The Modern Social Experience</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.15]">
              Where meaningful stories & people <span className="text-gradient">connect instantly.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
              Share updates, upload photos, chat in real time with friends, and discover new communities — all in a clean, modern, and privacy-focused space.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to={isAuthenticated ? '/home' : '/register'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 text-white px-8 py-3.5 rounded-2xl font-bold text-base shadow-xl shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>{isAuthenticated ? 'Enter Your Feed' : 'Join ConnectHub Free'}</span>
                <HiOutlineArrowRight className="w-5 h-5" />
              </Link>
              
              <a
                href="#interactive-demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800 px-7 py-3.5 rounded-2xl font-semibold text-base hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] shadow-sm transition-all"
              >
                <HiOutlineLightningBolt className="w-5 h-5 text-amber-500" />
                <span>Explore App Demo</span>
              </a>
            </div>

            {/* Key App Highlights Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 text-center border-t border-gray-200/60 dark:border-gray-800/60">
              <div className="p-3">
                <div className="text-2xl font-black text-gray-900 dark:text-white">Instant</div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Real-Time Messaging</div>
              </div>
              <div className="p-3">
                <div className="text-2xl font-black text-gray-900 dark:text-white">100% Free</div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">No Paywalls or Fees</div>
              </div>
              <div className="p-3">
                <div className="text-2xl font-black text-gray-900 dark:text-white">Encrypted</div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Account Security</div>
              </div>
              <div className="p-3">
                <div className="text-2xl font-black text-gray-900 dark:text-white">Dark / Light</div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Personalized Theme</div>
              </div>
            </div>

          </div>

          {/* Hero Preview Card / Live Mockup */}
          <div className="mt-12 max-w-5xl mx-auto">
            <div className="relative rounded-3xl p-2 sm:p-4 bg-gradient-to-b from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-2xl border border-gray-200/80 dark:border-gray-700/60">
              
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                  ConnectHub Social Feed
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Live & Connected</span>
                </div>
              </div>

              {/* Mockup Body: Feed + Chat Floating Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 sm:p-6 bg-white dark:bg-gray-950 rounded-2xl">
                
                {/* Left: Feed Preview */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-sm">
                        M
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-gray-900 dark:text-white">Maya Lin</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold">Photographer</span>
                        </div>
                        <span className="text-xs text-gray-400">@mayalin • 5 mins ago</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      Capturing the morning sunrise across the coast today! Beautiful light and fresh air. What are your weekend plans? 🌅🌊
                    </p>
                    <div className="flex items-center gap-6 pt-2 border-t border-gray-200/60 dark:border-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1 text-rose-500">
                        <HiOutlineHeart className="w-4 h-4 fill-rose-500 text-rose-500" />
                        <span>142 Likes</span>
                      </div>
                      <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400">
                        <HiOutlineAnnotation className="w-4 h-4" />
                        <span>28 Comments</span>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-600">
                        <HiOutlineSparkles className="w-4 h-4" />
                        <span>Trending Post</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-sm">
                        <HiOutlineBell className="w-4 h-4" />
                      </div>
                      <div className="text-xs">
                        <span className="font-semibold text-gray-900 dark:text-white">New Connection: </span>
                        <span className="text-gray-600 dark:text-gray-300">Sophia started following your profile</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold">Just now</span>
                  </div>
                </div>

                {/* Right: Real-Time Chat Floating Widget */}
                <div className="lg:col-span-5 flex flex-col justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-bold">
                          E
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900 dark:text-white">Emma Watson</div>
                        <div className="text-[10px] text-emerald-500 font-medium">Active now</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 font-bold">
                      Direct Message
                    </span>
                  </div>

                  <div className="space-y-2 py-3">
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs px-3 py-2 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm max-w-[85%]">
                        Hey! Are we still meeting for the community hangout today? ☕
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-teal-600 text-white text-xs px-3 py-2 rounded-2xl rounded-tr-none shadow-sm max-w-[85%]">
                        Yes, definitely! See you at 4 PM! 🎉
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2">
                    <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 text-xs text-gray-400">
                      Reply to Emma...
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
                      <HiOutlinePaperAirplane className="w-3.5 h-3.5 rotate-90" />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. CORE APP FEATURES (BENTO GRID)                            */}
      {/* ============================================================ */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-wider mb-2">
              <HiOutlineLightningBolt className="w-4 h-4" />
              <span>Designed For Seamless Socializing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              Everything you need to connect and share
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-base mt-3">
              ConnectHub combines all the essential social tools in a fast, clutter-free environment.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 (Large - Span 2) */}
            <div className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 shadow-lg relative overflow-hidden group hover:border-teal-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center text-2xl mb-5 shadow-sm">
                <HiOutlineChatAlt2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
                Instant Direct Messaging & Active Status
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 max-w-lg">
                Have private one-on-one conversations with friends. Send messages that deliver instantaneously, see who is currently online, and keep your chat history organized.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  💬 Instant Delivery
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  🟢 Live Online Status
                </span>
                <span className="px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                  🔒 Private Conversations
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 shadow-lg relative overflow-hidden group hover:border-cyan-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-2xl mb-5 shadow-sm">
                <HiOutlineBell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">
                Real-Time Activity Alerts
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                Stay in the loop with instant notification badges when someone likes your post, joins your conversation, or follows you.
              </p>
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">Instant Alert Badges →</span>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-5 shadow-sm">
                <HiOutlineSearch className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">
                Discover People & Creators
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                Find friends, colleagues, and creators across the network with quick instant search by username or real name.
              </p>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Instant Search →</span>
            </div>

            {/* Card 4 (Large - Span 2) */}
            <div className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 shadow-lg relative overflow-hidden group hover:border-cyan-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-2xl mb-5 shadow-sm">
                <HiOutlinePhotograph className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
                Rich Multimedia Posts & Clean Customization
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 max-w-lg">
                Publish high-resolution pictures and engaging stories. Customize your profile with custom bio and avatars, and switch effortlessly between daylight and sleek dark modes.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                  📸 Photo Uploads
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  🌓 Dark & Light Themes
                </span>
                <span className="px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  ✨ Interactive Reactions
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. HOW IT WORKS / APP HIGHLIGHTS                             */}
      {/* ============================================================ */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900/60 border-y border-gray-200/80 dark:border-gray-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-wider mb-2">
              <HiOutlineGlobeAlt className="w-4 h-4" />
              <span>Easy Getting Started</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              How ConnectHub Works
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
              Get started in four simple steps and begin sharing moments with your network.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800 text-center hover:scale-105 transition-transform">
              <div className="w-14 h-14 bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 font-bold shadow-sm">
                1
              </div>
              <h4 className="font-bold text-base text-gray-900 dark:text-white mb-2">Create Your Profile</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Sign up for free in seconds, add your profile photo, and personalize your bio.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800 text-center hover:scale-105 transition-transform">
              <div className="w-14 h-14 bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 font-bold shadow-sm">
                2
              </div>
              <h4 className="font-bold text-base text-gray-900 dark:text-white mb-2">Follow & Connect</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Search for friends, discover popular creators, and build your personalized network.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800 text-center hover:scale-105 transition-transform">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 font-bold shadow-sm">
                3
              </div>
              <h4 className="font-bold text-base text-gray-900 dark:text-white mb-2">Share & React</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Post photos, share thoughts, like your friends&apos; posts, and join engaging conversations.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800 text-center hover:scale-105 transition-transform">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 font-bold shadow-sm">
                4
              </div>
              <h4 className="font-bold text-base text-gray-900 dark:text-white mb-2">Chat in Real-Time</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Send private messages with instant delivery and stay connected anytime, anywhere.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. INTERACTIVE APP FEATURE PLAYGROUND                        */}
      {/* ============================================================ */}
      <section id="interactive-demo" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-wider mb-2">
              <HiOutlineSparkles className="w-4 h-4" />
              <span>Interactive App Preview</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Try out ConnectHub features right now
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Click the tabs below to explore how easy it is to chat, like posts, receive alerts, and browse profiles.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/30 scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <HiOutlineChatAlt2 className="w-4 h-4" />
              <span>Direct Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('feed')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'feed'
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/30 scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <HiOutlineThumbUp className="w-4 h-4" />
              <span>Social Feed & Likes</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/30 scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <HiOutlineBell className="w-4 h-4" />
              <span>Instant Notifications</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/30 scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <HiOutlineUserGroup className="w-4 h-4" />
              <span>User Profile & Network</span>
            </button>
          </div>

          {/* Interactive Playground Canvas */}
          <div className="max-w-3xl mx-auto bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-xl">
            
            {/* TAB 1: REAL-TIME CHAT */}
            {activeTab === 'chat' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold shadow-sm">
                      A
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">Alex Johnson</h4>
                      <p className="text-xs text-emerald-500 flex items-center gap-1 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Online now
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full font-semibold">
                    Direct Chat
                  </span>
                </div>

                <div className="h-56 overflow-y-auto space-y-3 p-3 bg-white dark:bg-gray-950 rounded-2xl border border-gray-200/60 dark:border-gray-800/80">
                  {demoChatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm ${
                          msg.sender === 'me'
                            ? 'bg-teal-600 text-white rounded-tr-none shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span className={`text-[10px] mt-1 block ${msg.sender === 'me' ? 'text-teal-100' : 'text-gray-400'}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendDemoMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={demoInputText}
                    onChange={(e) => setDemoInputText(e.target.value)}
                    placeholder="Type a message (e.g. 'Hey, excited to connect!')..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-teal-500/25 transition-all cursor-pointer"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: SOCIAL FEED & LIKES */}
            {activeTab === 'feed' && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-950 p-5 rounded-2xl border border-gray-200/70 dark:border-gray-800 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-sm">
                      S
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-900 dark:text-white">Sarah Miller</div>
                      <div className="text-xs text-gray-400">@sarah • Travel & Design Enthusiast</div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-800 dark:text-gray-200 mb-4">
                    Exploring coastal nature trails today! Loving how easy it is to share moments and stay in touch with everyone here. 🌿✨
                  </p>

                  <div className="bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-emerald-500/10 p-4 rounded-xl border border-teal-200/40 dark:border-teal-800/40 mb-4 flex items-center gap-3">
                    <HiOutlinePhotograph className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      <span className="font-bold text-gray-900 dark:text-white">Photo Album: </span>
                      High-resolution photo and media sharing built right in.
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-3 border-t border-gray-200/60 dark:border-gray-800">
                    <button
                      onClick={handleDemoLike}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        demoLiked
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 scale-105'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <HiOutlineHeart className={`w-5 h-5 ${demoLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{demoLikesCount} Likes</span>
                    </button>

                    <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                      <HiOutlineAnnotation className="w-5 h-5" />
                      <span>18 Comments</span>
                    </button>
                  </div>
                </div>

                <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                  💡 Tap the <span className="text-rose-500 font-bold">Like button</span> to see real-time interaction in action!
                </div>
              </div>
            )}

            {/* TAB 3: LIVE NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <HiOutlineBell className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <span className="font-bold text-sm text-gray-900 dark:text-white">Notification Feed</span>
                  </div>
                  <button
                    onClick={() => setDemoNotifCount((prev) => prev + 1)}
                    className="text-xs bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 font-bold px-3 py-1.5 rounded-xl border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition-colors cursor-pointer"
                  >
                    + Simulate Activity
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="p-3.5 bg-white dark:bg-gray-950 rounded-2xl border border-gray-200/80 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-sm">
                        <HiOutlineHeart className="w-5 h-5 fill-rose-500" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900 dark:text-white">David liked your post</div>
                        <div className="text-[11px] text-gray-400">&quot;Exploring coastal nature trails today!&quot;</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">Just now</span>
                  </div>

                  <div className="p-3.5 bg-white dark:bg-gray-950 rounded-2xl border border-gray-200/80 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-sm">
                        <HiOutlineUserGroup className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900 dark:text-white">Elena followed you</div>
                        <div className="text-[11px] text-gray-400">@elena • Digital Artist</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-semibold">2m ago</span>
                  </div>

                  {demoNotifCount > 3 && (
                    <div className="p-3.5 bg-teal-50 dark:bg-teal-950/50 rounded-2xl border border-teal-200 dark:border-teal-800/80 flex items-center justify-between animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
                          <HiOutlineChatAlt2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 dark:text-white">New chat message from Alex</div>
                          <div className="text-[11px] text-teal-700 dark:text-teal-300">Tap to reply immediately</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600">New</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: PROFILE & NETWORK */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-950 p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800 text-center">
                  <div className="relative inline-block mb-3">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-600 via-cyan-600 to-emerald-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                      JS
                    </div>
                    <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-950" />
                  </div>
                  <h4 className="font-extrabold text-lg text-gray-900 dark:text-white">Jessica Scott</h4>
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">@jessica • Creative Writer & Community Host</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 max-w-md mx-auto mt-2">
                    Sharing thoughts on everyday moments, creative writing, and inspiring community discussions.
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-200/60 dark:border-gray-800">
                    <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-900">
                      <div className="font-black text-sm text-gray-900 dark:text-white">58</div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold">Posts</div>
                    </div>
                    <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-900">
                      <div className="font-black text-sm text-gray-900 dark:text-white">2.4k</div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold">Followers</div>
                    </div>
                    <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-900">
                      <div className="font-black text-sm text-gray-900 dark:text-white">412</div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold">Following</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. COMMUNITY REVIEWS & EXPERIENCES                           */}
      {/* ============================================================ */}
      <section id="community" className="py-20 bg-white dark:bg-gray-900/60 border-y border-gray-200/80 dark:border-gray-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-wider mb-2">
              <HiOutlineUserGroup className="w-4 h-4" />
              <span>Member Stories</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Loved by members and creators everywhere
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
              Hear how ConnectHub makes staying connected effortless and enjoyable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {'★'.repeat(5)}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  &quot;The instant chat feature is amazing. Messaging friends is lightning fast, and I love how clean and uncluttered the entire feed is.&quot;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-600 text-white font-bold flex items-center justify-center shadow-sm">
                  M
                </div>
                <div>
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">Marcus Vance</h5>
                  <span className="text-xs text-gray-400">Community Member</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {'★'.repeat(5)}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  &quot;The dark mode looks stunning on my phone! Uploading photos and getting instant notifications when friends comment makes it so fun to use.&quot;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-600 text-white font-bold flex items-center justify-center shadow-sm">
                  K
                </div>
                <div>
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">Kavya Sharma</h5>
                  <span className="text-xs text-gray-400">Visual Artist</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {'★'.repeat(5)}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  &quot;Finally, a social app that focuses on what matters: real conversations, great connections, and zero annoying spam.&quot;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-600 text-white font-bold flex items-center justify-center shadow-sm">
                  R
                </div>
                <div>
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">Rahul Patel</h5>
                  <span className="text-xs text-gray-400">Content Creator</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. FREQUENTLY ASKED QUESTIONS                                */}
      {/* ============================================================ */}
      <section id="faq" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-wider mb-2">
              <HiOutlineCheckCircle className="w-4 h-4" />
              <span>Questions & Answers</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
              Everything you need to know about using ConnectHub.
            </p>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-sm sm:text-base text-gray-900 dark:text-white cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <HiOutlineChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-teal-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-200/50 dark:border-gray-800/50 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. CALL TO ACTION BANNER                                     */}
      {/* ============================================================ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-teal-700 via-cyan-700 to-blue-800 text-white overflow-hidden shadow-2xl">
            
            <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Ready to connect with friends today?
              </h2>
              <p className="text-teal-100 text-base sm:text-lg">
                Create your free account and experience seamless social posts, instant conversations, and vibrant community sharing.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-teal-700 px-8 py-3.5 rounded-2xl font-bold text-base shadow-lg hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Get Started Free</span>
                  <HiOutlineArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-800/60 hover:bg-teal-800/80 text-white border border-teal-400/40 px-8 py-3.5 rounded-2xl font-semibold text-base transition-all"
                >
                  <span>Sign In to Account</span>
                </Link>
              </div>
            </div>

            {/* Decorative background blur shapes */}
            <div className="absolute -top-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. FOOTER                                                    */}
      {/* ============================================================ */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500 dark:text-gray-400">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-extrabold text-sm">C</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white">ConnectHub</span>
            <span>— The place to connect, chat, and share.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">How It Works</a>
            <a href="#interactive-demo" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Demo</a>
            <a href="#faq" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">FAQ</a>
            <Link to="/login" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Sign In</Link>
          </div>

          <div>
            &copy; {new Date().getFullYear()} ConnectHub. All rights reserved.
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Landing;
