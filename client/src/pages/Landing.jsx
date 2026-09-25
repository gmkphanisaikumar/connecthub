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
  HiOutlineLockClosed,
  HiOutlineDeviceMobile,
} from 'react-icons/hi';

const Landing = () => {
  const { isAuthenticated, user } = useAuth();

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
  const [demoLikesCount, setDemoLikesCount] = useState(24);
  const [demoChatMessages, setDemoChatMessages] = useState([
    { id: 1, sender: 'alex', text: 'Hey everyone! Excited to check out the new ConnectHub release! 🚀', time: 'Just now' },
    { id: 2, sender: 'me', text: 'Welcome Alex! Real-time messaging with Socket.IO is lightning fast ⚡', time: 'Just now' },
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
      a: 'ConnectHub is a modern, full-stack social networking platform engineered for high-performance communication. It combines dynamic social feeds, instant WebSocket chat, media sharing, follow connections, and adaptive themes into one seamless experience.',
    },
    {
      q: 'How does real-time chat and notifications work?',
      a: 'We leverage Socket.IO over WebSockets. Whenever a new message or interaction occurs, the server emits instantaneous events to the connected clients with sub-50ms latency without requiring page refreshes.',
    },
    {
      q: 'Is ConnectHub responsive across all devices?',
      a: 'Yes! ConnectHub is designed mobile-first with Tailwind CSS. It delivers a fluid, optimized UI across smartphones, tablets, laptops, and ultra-wide desktops.',
    },
    {
      q: 'How is user data and authentication secured?',
      a: 'Authentication is powered by JSON Web Tokens (JWT) and bcrypt password hashing. Protected REST APIs and Socket handshakes verify user sessions securely.',
    },
    {
      q: 'What tech stack powers ConnectHub?',
      a: 'The frontend is crafted with React 19, Tailwind CSS, Vite, and React Router. The backend is built with Node.js, Express, Socket.IO, and MongoDB Atlas with Mongoose ODM.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 selection:bg-primary-500 selection:text-white">
      
      {/* ============================================================ */}
      {/* 1. TOP NAVBAR / HEADER                                       */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-extrabold text-xl tracking-tight">C</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Connect<span className="text-primary-600 dark:text-primary-400">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
            <a href="#features" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</a>
            <a href="#interactive-demo" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Live Demo</a>
            <a href="#tech-stack" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Tech Stack</a>
            <a href="#testimonials" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Community</a>
            <a href="#faq" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">FAQ</a>
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
              {darkMode ? <HiOutlineSun className="w-5 h-5 text-amber-400" /> : <HiOutlineMoon className="w-5 h-5 text-indigo-600" />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/home"
                className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Go to Feed</span>
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-4 sm:px-5 py-2 rounded-xl text-sm font-semibold shadow-md shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
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
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary-500/20 dark:bg-primary-600/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[300px] bg-purple-500/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10 animate-float" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Floating Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800/60 shadow-sm animate-float">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>ConnectHub 1.0 • Real-Time Web Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.15]">
              Where meaningful ideas & people <span className="text-gradient">connect instantly.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
              Experience the next generation of social collaboration with instant WebSocket messaging, dynamic multimedia feeds, intelligent search, and sleek dark mode.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to={isAuthenticated ? '/home' : '/register'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold text-base shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>{isAuthenticated ? 'Enter Your Feed' : 'Join ConnectHub Free'}</span>
                <HiOutlineArrowRight className="w-5 h-5" />
              </Link>
              
              <a
                href="#interactive-demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800 px-7 py-3.5 rounded-2xl font-semibold text-base hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] shadow-sm transition-all"
              >
                <HiOutlineLightningBolt className="w-5 h-5 text-amber-500" />
                <span>Try Interactive Demo</span>
              </a>
            </div>

            {/* Key Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 text-center border-t border-gray-200/60 dark:border-gray-800/60">
              <div className="p-3">
                <div className="text-2xl font-black text-gray-900 dark:text-white">&lt; 50ms</div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">WebSocket Latency</div>
              </div>
              <div className="p-3">
                <div className="text-2xl font-black text-gray-900 dark:text-white">100%</div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Real-Time Sync</div>
              </div>
              <div className="p-3">
                <div className="text-2xl font-black text-gray-900 dark:text-white">JWT + Bcrypt</div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Encrypted Security</div>
              </div>
              <div className="p-3">
                <div className="text-2xl font-black text-gray-900 dark:text-white">Dark / Light</div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Seamless Themes</div>
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
                <div className="text-xs font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                  connecthub.app/feed
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Live WebSocket</span>
                </div>
              </div>

              {/* Mockup Body: Feed + Chat Floating Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 sm:p-6 bg-white dark:bg-gray-950 rounded-2xl">
                
                {/* Left: Feed Preview */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        P
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-gray-900 dark:text-white">Phani Sai</span>
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 font-semibold">Creator</span>
                        </div>
                        <span className="text-xs text-gray-400">@phani • 5 mins ago</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      🚀 ConnectHub is officially live! We combined the best parts of real-time messaging, vibrant social feeds, and clean responsive UI. What feature are you most excited to try?
                    </p>
                    <div className="flex items-center gap-6 pt-2 border-t border-gray-200/60 dark:border-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1 text-rose-500">
                        <HiOutlineHeart className="w-4 h-4 fill-rose-500 text-rose-500" />
                        <span>128 Likes</span>
                      </div>
                      <div className="flex items-center gap-1 text-primary-600 dark:text-primary-400">
                        <HiOutlineAnnotation className="w-4 h-4" />
                        <span>32 Comments</span>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-600">
                        <HiOutlineSparkles className="w-4 h-4" />
                        <span>Trending</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-primary-50 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center">
                        <HiOutlineBell className="w-4 h-4" />
                      </div>
                      <div className="text-xs">
                        <span className="font-semibold text-gray-900 dark:text-white">New Follower Alert: </span>
                        <span className="text-gray-600 dark:text-gray-300">Sophia started following your profile</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-primary-600 dark:text-primary-400 font-bold">Live</span>
                  </div>
                </div>

                {/* Right: Real-Time Chat Floating Widget */}
                <div className="lg:col-span-5 flex flex-col justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">
                          E
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900 dark:text-white">Emma Watson</div>
                        <div className="text-[10px] text-emerald-500 font-medium">Online via Socket</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 font-bold">
                      Direct Chat
                    </span>
                  </div>

                  <div className="space-y-2 py-3">
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs px-3 py-2 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm max-w-[85%]">
                        Did you see how fast the comments update? Instant! ⚡
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-primary-600 text-white text-xs px-3 py-2 rounded-2xl rounded-tr-none shadow-sm max-w-[85%]">
                        Yes! Socket.IO handles live sync seamlessly. 🔥
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2">
                    <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 text-xs text-gray-400">
                      Type a message...
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center">
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
      {/* 3. INTERACTIVE FEATURE PLAYGROUND                            */}
      {/* ============================================================ */}
      <section id="interactive-demo" className="py-16 bg-white dark:bg-gray-900/60 border-y border-gray-200/80 dark:border-gray-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-bold text-xs uppercase tracking-wider mb-2">
              <HiOutlineSparkles className="w-4 h-4" />
              <span>Interactive Playground</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Test drive ConnectHub features right here
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Click the tabs below to interact with live simulations of our core modules.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <HiOutlineChatAlt2 className="w-4 h-4" />
              <span>1. Real-Time Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('feed')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'feed'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <HiOutlineThumbUp className="w-4 h-4" />
              <span>2. Social Feed & Likes</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <HiOutlineBell className="w-4 h-4" />
              <span>3. Live Notifications</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <HiOutlineUserGroup className="w-4 h-4" />
              <span>4. Profile & Follow Network</span>
            </button>
          </div>

          {/* Interactive Playground Canvas */}
          <div className="max-w-3xl mx-auto bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-xl">
            
            {/* TAB 1: REAL-TIME CHAT */}
            {activeTab === 'chat' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold">
                      A
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">Alex Johnson</h4>
                      <p className="text-xs text-emerald-500 flex items-center gap-1 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Online via Socket.IO
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full font-semibold">
                    Simulated Socket
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
                            ? 'bg-primary-600 text-white rounded-tr-none shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span className={`text-[10px] mt-1 block ${msg.sender === 'me' ? 'text-primary-200' : 'text-gray-400'}`}>
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
                    placeholder="Type a test message (e.g. 'Hello ConnectHub!')..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-primary-500/25 transition-all cursor-pointer"
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      S
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-900 dark:text-white">Sarah Miller</div>
                      <div className="text-xs text-gray-400">@sarah • Developer & Designer</div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-800 dark:text-gray-200 mb-4">
                    Just integrated ConnectHub real-time social features into our workflow. The performance is silky smooth and dark mode looks incredible! 💻✨
                  </p>

                  <div className="bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-pink-500/10 p-4 rounded-xl border border-primary-200/40 dark:border-primary-800/40 mb-4 flex items-center gap-3">
                    <HiOutlinePhotograph className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      <span className="font-bold text-gray-900 dark:text-white">Media Attachment: </span>
                      Interactive media support with auto-resizing & instant cache.
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
                      <span>8 Comments</span>
                    </button>
                  </div>
                </div>

                <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                  💡 Click the <span className="text-rose-500 font-bold">Like button</span> above to test dynamic state changes!
                </div>
              </div>
            )}

            {/* TAB 3: LIVE NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <HiOutlineBell className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span className="font-bold text-sm text-gray-900 dark:text-white">Instant Alert Center</span>
                  </div>
                  <button
                    onClick={() => setDemoNotifCount((prev) => prev + 1)}
                    className="text-xs bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 font-bold px-3 py-1.5 rounded-xl border border-primary-200 dark:border-primary-800 hover:bg-primary-100 transition-colors cursor-pointer"
                  >
                    + Trigger Live Event
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="p-3.5 bg-white dark:bg-gray-950 rounded-2xl border border-gray-200/80 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                        <HiOutlineHeart className="w-5 h-5 fill-rose-500" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900 dark:text-white">David liked your post</div>
                        <div className="text-[11px] text-gray-400">&quot;ConnectHub is officially live!&quot;</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-primary-600 dark:text-primary-400 font-semibold">Just now</span>
                  </div>

                  <div className="p-3.5 bg-white dark:bg-gray-950 rounded-2xl border border-gray-200/80 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                        <HiOutlineUserGroup className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900 dark:text-white">Elena followed you</div>
                        <div className="text-[11px] text-gray-400">@elena • Frontend Engineer</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-semibold">2m ago</span>
                  </div>

                  {demoNotifCount > 3 && (
                    <div className="p-3.5 bg-primary-50 dark:bg-primary-950/50 rounded-2xl border border-primary-200 dark:border-primary-800/80 flex items-center justify-between animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                          <HiOutlineChatAlt2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 dark:text-white">New direct message incoming</div>
                          <div className="text-[11px] text-primary-700 dark:text-primary-300">Live payload received via WebSockets</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600">Simulated</span>
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
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-600 via-indigo-600 to-purple-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                      GS
                    </div>
                    <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-950" />
                  </div>
                  <h4 className="font-extrabold text-lg text-gray-900 dark:text-white">G. M. K. Phani Sai Kumar</h4>
                  <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold">@phanisai • Full Stack Architect</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 max-w-md mx-auto mt-2">
                    Building next-gen real-time applications with React, Node.js, Express, Socket.IO & MongoDB.
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-200/60 dark:border-gray-800">
                    <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-900">
                      <div className="font-black text-sm text-gray-900 dark:text-white">42</div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold">Posts</div>
                    </div>
                    <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-900">
                      <div className="font-black text-sm text-gray-900 dark:text-white">1.8k</div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold">Followers</div>
                    </div>
                    <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-900">
                      <div className="font-black text-sm text-gray-900 dark:text-white">356</div>
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
      {/* 4. BENTO GRID CORE FEATURES                                  */}
      {/* ============================================================ */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-bold text-xs uppercase tracking-wider mb-2">
              <HiOutlineLightningBolt className="w-4 h-4" />
              <span>Engineered For Speed & Delight</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              Everything you need in a modern social network
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-base mt-3">
              Crafted from the ground up with high performance, intuitive design, and clean architecture.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 (Large - Span 2) */}
            <div className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 shadow-lg relative overflow-hidden group hover:border-primary-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 flex items-center justify-center text-2xl mb-5 shadow-sm">
                <HiOutlineChatAlt2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
                Real-Time Chat & Direct Messaging
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 max-w-lg">
                Instant peer-to-peer conversations powered by Socket.IO. Experience instant message delivery, live online presence indicators, and message history without manual reloading.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                  ⚡ WebSockets
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  🟢 Online Indicators
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  💬 Instant Sync
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 shadow-lg relative overflow-hidden group hover:border-purple-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl mb-5 shadow-sm">
                <HiOutlineBell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">
                Live Notification System
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                Stay updated on likes, comments, and new followers instantly with animated Navbar badges and dedicated activity log.
              </p>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Zero Refresh Needed →</span>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-5 shadow-sm">
                <HiOutlineSearch className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">
                Smart User Discovery
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                Lightning fast debounced search allows you to discover creators, search usernames, and build your social circle easily.
              </p>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Debounced Querying →</span>
            </div>

            {/* Card 4 (Large - Span 2) */}
            <div className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 shadow-lg relative overflow-hidden group hover:border-indigo-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl mb-5 shadow-sm">
                <HiOutlineShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
                Secure JWT & Adaptive Dark/Light Themes
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 max-w-lg">
                Your account is guarded with industry-standard bcrypt encryption and signed JWT credentials. Toggle between deep contrast dark mode and clean light aesthetics with saved preferences.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  🔒 Bcrypt Salted
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  🌓 Class-Based Dark Mode
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  🛡️ Protected Routes
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. TECH STACK ARCHITECTURE                                   */}
      {/* ============================================================ */}
      <section id="tech-stack" className="py-16 bg-white dark:bg-gray-900/60 border-y border-gray-200/80 dark:border-gray-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-bold text-xs uppercase tracking-wider mb-2">
              <HiOutlineGlobeAlt className="w-4 h-4" />
              <span>Full-Stack Architecture</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Built with industry-leading technologies
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800 text-center hover:scale-105 transition-transform">
              <div className="text-3xl mb-2">⚛️</div>
              <div className="font-bold text-sm text-gray-900 dark:text-white">React 19</div>
              <div className="text-xs text-gray-400 mt-1">Component UI</div>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800 text-center hover:scale-105 transition-transform">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-bold text-sm text-gray-900 dark:text-white">Vite & Tailwind</div>
              <div className="text-xs text-gray-400 mt-1">Fast Styling & Bundling</div>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800 text-center hover:scale-105 transition-transform">
              <div className="text-3xl mb-2">🟢</div>
              <div className="font-bold text-sm text-gray-900 dark:text-white">Node & Express</div>
              <div className="text-xs text-gray-400 mt-1">REST API Backend</div>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800 text-center hover:scale-105 transition-transform">
              <div className="text-3xl mb-2">🍃</div>
              <div className="font-bold text-sm text-gray-900 dark:text-white">MongoDB Atlas</div>
              <div className="text-xs text-gray-400 mt-1">Mongoose ODM</div>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800 text-center hover:scale-105 transition-transform">
              <div className="text-3xl mb-2">🔌</div>
              <div className="font-bold text-sm text-gray-900 dark:text-white">Socket.IO</div>
              <div className="text-xs text-gray-400 mt-1">Bidirectional Events</div>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800 text-center hover:scale-105 transition-transform">
              <div className="text-3xl mb-2">🔐</div>
              <div className="font-bold text-sm text-gray-900 dark:text-white">JWT & Bcrypt</div>
              <div className="text-xs text-gray-400 mt-1">Token Security</div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. TESTIMONIALS & COMMUNITY                                  */}
      {/* ============================================================ */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-bold text-xs uppercase tracking-wider mb-2">
              <HiOutlineUserGroup className="w-4 h-4" />
              <span>Community Reviews</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Loved by creators and developers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {'★'.repeat(5)}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  &quot;The real-time chat with Socket.IO is so snappy. It feels just as fast as Discord or Telegram. The UI is super clean!&quot;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center">
                  M
                </div>
                <div>
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">Marcus Vance</h5>
                  <span className="text-xs text-gray-400">Software Developer</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {'★'.repeat(5)}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  &quot;The dark mode and responsive layout on mobile is flawless. The like animations and notification counters give it a high-budget feel.&quot;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 text-white font-bold flex items-center justify-center">
                  K
                </div>
                <div>
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">Kavya Sharma</h5>
                  <span className="text-xs text-gray-400">UI/UX Designer</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {'★'.repeat(5)}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  &quot;From registration to posting media and instant messaging, the whole full-stack MERN workflow is rock solid.&quot;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center">
                  R
                </div>
                <div>
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">Rahul Patel</h5>
                  <span className="text-xs text-gray-400">Tech Enthusiast</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. FREQUENTLY ASKED QUESTIONS (ACCORDION)                    */}
      {/* ============================================================ */}
      <section id="faq" className="py-16 bg-white dark:bg-gray-900/60 border-y border-gray-200/80 dark:border-gray-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-bold text-xs uppercase tracking-wider mb-2">
              <HiOutlineCheckCircle className="w-4 h-4" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-sm sm:text-base text-gray-900 dark:text-white cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <HiOutlineChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-primary-600' : ''
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
          <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 text-white overflow-hidden shadow-2xl">
            
            <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Ready to connect with the world in real-time?
              </h2>
              <p className="text-primary-100 text-base sm:text-lg">
                Create your account today and experience seamless social conversations, post sharing, and live notifications.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-8 py-3.5 rounded-2xl font-bold text-base shadow-lg hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Get Started Now</span>
                  <HiOutlineArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-700/60 hover:bg-primary-700/80 text-white border border-primary-400/40 px-8 py-3.5 rounded-2xl font-semibold text-base transition-all"
                >
                  <span>Sign In to Account</span>
                </Link>
              </div>
            </div>

            {/* Decorative background blur shapes */}
            <div className="absolute -top-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. FOOTER                                                    */}
      {/* ============================================================ */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500 dark:text-gray-400">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-primary-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-extrabold text-sm">C</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white">ConnectHub</span>
            <span>— Real-time social connection platform</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</a>
            <a href="#interactive-demo" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Demo</a>
            <a href="#faq" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">FAQ</a>
            <Link to="/login" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Sign In</Link>
          </div>

          <div>
            &copy; {new Date().getFullYear()} ConnectHub. Built with React & Node.js.
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Landing;
