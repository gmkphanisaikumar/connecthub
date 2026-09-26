import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineChatAlt2,
  HiOutlineHeart,
  HiHeart,
  HiOutlineBell,
  HiOutlineSearch,
  HiOutlineUserGroup,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineArrowRight,
  HiOutlinePhotograph,
  HiOutlineAnnotation,
  HiOutlinePaperAirplane,
  HiOutlineGlobeAlt,
  HiOutlineBookmark,
  HiOutlineDotsHorizontal,
  HiOutlinePlusCircle,
  HiOutlineShare,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlineMail,
} from 'react-icons/hi';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Interactive Story & Feed States
  const [activeStory, setActiveStory] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(384);
  const [isSaved, setIsSaved] = useState(false);
  const [commentsList, setCommentsList] = useState([
    { id: 1, user: 'sophia_art', text: 'The colors in this shot are absolutely breathtaking! 😍🌅' },
    { id: 2, user: 'david_travels', text: 'Which camera settings did you use for this lighting?' },
  ]);
  const [inputComment, setInputComment] = useState('');
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);

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

  const handleLikeToggle = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikeCount((prev) => prev + 1);
      setIsLiked(true);
      setShowHeartOverlay(true);
      setTimeout(() => setShowHeartOverlay(false), 900);
    }
  };

  const handleDoubleTapPost = () => {
    if (!isLiked) {
      setLikeCount((prev) => prev + 1);
      setIsLiked(true);
    }
    setShowHeartOverlay(true);
    setTimeout(() => setShowHeartOverlay(false), 900);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!inputComment.trim()) return;
    setCommentsList((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: 'you',
        text: inputComment.trim(),
      },
    ]);
    setInputComment('');
  };

  const storiesData = [
    { id: 0, name: 'Your Story', initial: '+', isUser: true, bg: 'from-gray-300 to-gray-400' },
    { id: 1, name: 'Elena_v', initial: 'E', bg: 'from-teal-400 via-cyan-500 to-blue-500', active: true },
    { id: 2, name: 'Alex_photo', initial: 'A', bg: 'from-emerald-400 via-teal-500 to-cyan-600', active: true },
    { id: 3, name: 'Sarah_m', initial: 'S', bg: 'from-cyan-400 via-blue-500 to-teal-500', active: true },
    { id: 4, name: 'Lucas_99', initial: 'L', bg: 'from-teal-500 via-emerald-500 to-cyan-500', active: true },
    { id: 5, name: 'Maya_art', initial: 'M', bg: 'from-blue-400 via-teal-500 to-emerald-400', active: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 selection:bg-teal-500 selection:text-white">
      
      {/* ============================================================ */}
      {/* 1. SOCIAL HEADER (INSTAGRAM/FACEBOOK STYLE)                  */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-tr from-teal-500 via-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-extrabold text-lg">C</span>
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
              Connect<span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-500">Hub</span>
            </span>
          </Link>

          {/* Search Bar Simulation (Social Style) */}
          <div className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3.5 py-1.5 rounded-full w-64 text-xs text-gray-400 border border-gray-200/60 dark:border-gray-700/60">
            <HiOutlineSearch className="text-sm text-gray-400" />
            <span>Search friends, photos, tags...</span>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-2.5">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <HiOutlineSun className="w-5 h-5 text-amber-400" /> : <HiOutlineMoon className="w-5 h-5 text-cyan-600" />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/home"
                className="flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Go to Feed</span>
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. HERO: INSTAGRAM / FACEBOOK SOCIAL SHOWCASE                */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-teal-500/15 dark:bg-teal-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[300px] bg-cyan-500/15 dark:bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Social Pitch & Quick Join */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span>See What Your Friends Are Sharing</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.12]">
                Connect with friends & share your <span className="text-gradient">moments.</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                A modern social platform to share photos, post daily stories, direct message your friends, and discover a world of creators without distractions.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 text-white px-7 py-3.5 rounded-2xl font-bold text-base shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Create Free Account</span>
                  <HiOutlineArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800 px-6 py-3.5 rounded-2xl font-semibold text-base hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm"
                >
                  <span>Log In to Existing Account</span>
                </Link>
              </div>

              {/* Social Highlights List */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-200/80 dark:border-gray-800/80 max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">Photo Feeds</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">High-Res Uploads</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">Direct Chat</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Instant Messaging</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">Stories & Alerts</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Live Engagement</div>
                </div>
              </div>

            </div>

            {/* Right Column: Live Instagram/Facebook Style Phone Feed Card */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden transition-all">
                
                {/* 1. Top Stories Row */}
                <div className="p-3.5 border-b border-gray-100 dark:border-gray-800/80 overflow-x-auto scrollbar-none flex items-center gap-3">
                  {storiesData.map((story) => (
                    <button
                      key={story.id}
                      onClick={() => setActiveStory(story.id)}
                      className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer focus:outline-none"
                    >
                      <div className={`p-0.5 rounded-full ${story.isUser ? 'border-2 border-dashed border-gray-300 dark:border-gray-600' : 'bg-gradient-to-tr from-amber-400 via-teal-500 to-cyan-500'} group-hover:scale-105 transition-transform`}>
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${story.bg} flex items-center justify-center text-white font-bold border-2 border-white dark:border-gray-900 shadow-sm`}>
                          {story.initial}
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300 truncate w-14 text-center">
                        {story.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* 2. Live Social Feed Post */}
                <div className="relative">
                  
                  {/* Post Header */}
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500 via-cyan-500 to-emerald-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        E
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-gray-900 dark:text-white">Elena Vance</span>
                          <span className="text-teal-500 text-xs">●</span>
                          <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 cursor-pointer">Follow</span>
                        </div>
                        <span className="text-[11px] text-gray-400">San Francisco, California</span>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      <HiOutlineDotsHorizontal className="text-lg" />
                    </button>
                  </div>

                  {/* Post Media (Double Tap to Like Experience) */}
                  <div
                    onDoubleClick={handleDoubleTapPost}
                    className="relative w-full h-64 sm:h-72 bg-gradient-to-br from-teal-800 via-cyan-900 to-slate-900 flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden"
                  >
                    {/* Simulated aesthetic photo visual */}
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="relative z-10 text-center px-6">
                      <div className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shadow-lg">
                        🌊
                      </div>
                      <p className="text-white font-bold text-lg drop-shadow-md">Pacific Coast Sunset</p>
                      <p className="text-teal-200 text-xs mt-1">Double tap image to like ❤️</p>
                    </div>

                    {/* Double-tap animated heart overlay */}
                    {showHeartOverlay && (
                      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none animate-ping">
                        <HiHeart className="text-rose-500 text-8xl drop-shadow-2xl opacity-90" />
                      </div>
                    )}
                  </div>

                  {/* Action Bar (Like, Comment, Share, Save) */}
                  <div className="px-4 pt-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleLikeToggle}
                        className="flex items-center gap-1.5 transition-transform active:scale-125 focus:outline-none cursor-pointer"
                      >
                        {isLiked ? (
                          <HiHeart className="text-2xl text-rose-500 fill-rose-500 transition-colors" />
                        ) : (
                          <HiOutlineHeart className="text-2xl text-gray-700 dark:text-gray-300 hover:text-rose-500 transition-colors" />
                        )}
                      </button>
                      <button className="text-2xl text-gray-700 dark:text-gray-300 hover:text-teal-500 transition-colors cursor-pointer">
                        <HiOutlineAnnotation />
                      </button>
                      <button className="text-2xl text-gray-700 dark:text-gray-300 hover:text-teal-500 transition-colors cursor-pointer">
                        <HiOutlinePaperAirplane className="rotate-45" />
                      </button>
                    </div>

                    <button
                      onClick={() => setIsSaved(!isSaved)}
                      className="text-2xl text-gray-700 dark:text-gray-300 hover:text-teal-500 transition-colors cursor-pointer"
                    >
                      <HiOutlineBookmark className={isSaved ? 'text-teal-500 fill-teal-500' : ''} />
                    </button>
                  </div>

                  {/* Likes & Caption */}
                  <div className="px-4 pt-2 pb-1 text-xs text-gray-900 dark:text-white space-y-1">
                    <p className="font-bold text-sm">
                      {likeCount.toLocaleString()} likes
                    </p>
                    <p>
                      <span className="font-bold mr-1.5">Elena Vance</span>
                      Golden hour over the cliffs today. Nothing beats the sea breeze! 🌅🌊 #nature #photography #weekend
                    </p>
                  </div>

                  {/* Comments Preview */}
                  <div className="px-4 py-1 space-y-1 text-xs">
                    {commentsList.map((c) => (
                      <div key={c.id} className="text-gray-700 dark:text-gray-300">
                        <span className="font-bold text-gray-900 dark:text-white mr-1.5">{c.user}</span>
                        <span>{c.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Add Comment */}
                  <form onSubmit={handleAddComment} className="px-4 py-2.5 mt-2 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
                    <input
                      type="text"
                      value={inputComment}
                      onChange={(e) => setInputComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 text-xs bg-transparent focus:outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
                    />
                    <button
                      type="submit"
                      disabled={!inputComment.trim()}
                      className="text-xs font-bold text-teal-600 dark:text-teal-400 disabled:opacity-40 cursor-pointer"
                    >
                      Post
                    </button>
                  </form>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. CORE SOCIAL APP FEATURES (INSTAGRAM/FB PARITY)            */}
      {/* ============================================================ */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900/60 border-y border-gray-200/80 dark:border-gray-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-wider mb-2">
              <HiOutlineSparkles className="w-4 h-4" />
              <span>Built For Real Connections</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              Every feature you love in a social app
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
              Stay close with your friends, follow favorite creators, and express yourself freely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1: Photo & Feed Sharing */}
            <div className="p-7 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-sm">
                <HiOutlinePhotograph />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Photo Sharing & Feeds
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Upload pictures from your camera roll, write rich captions, add location tags, and let your network like and comment.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
                <span>Likes, comments, bookmarks →</span>
              </div>
            </div>

            {/* Feature 2: Direct Messenger */}
            <div className="p-7 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-sm">
                <HiOutlineChatAlt2 />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Real-Time Direct Chat
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Message friends one-on-one with immediate delivery, online presence badges, and live instant reply capabilities.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                <span>Private & instant messaging →</span>
              </div>
            </div>

            {/* Feature 3: Follow & Discover Creators */}
            <div className="p-7 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-sm">
                <HiOutlineUserGroup />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Follow Friends & Profiles
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Customize your bio, build your follower circle, search for people by name, and curate your personalized feed.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Grow your social network →</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. HOW IT WORKS (SIMPLE & INTUITIVE)                         */}
      {/* ============================================================ */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Get Started in Seconds
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
              Join millions of people who connect, chat, and share daily.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center shadow-sm">
              <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center text-xl font-black mx-auto mb-4 border border-teal-200/50">
                1
              </div>
              <h4 className="font-bold text-base text-gray-900 dark:text-white mb-1.5">Sign Up Free</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Enter your username, full name, and email to create your profile immediately.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center shadow-sm">
              <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center text-xl font-black mx-auto mb-4 border border-cyan-200/50">
                2
              </div>
              <h4 className="font-bold text-base text-gray-900 dark:text-white mb-1.5">Personalize Bio</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Upload your avatar picture and write a short bio that describes who you are.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center text-xl font-black mx-auto mb-4 border border-emerald-200/50">
                3
              </div>
              <h4 className="font-bold text-base text-gray-900 dark:text-white mb-1.5">Post & Share</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Share photos and thoughts, discover posts from friends, and leave comments.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center shadow-sm">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center text-xl font-black mx-auto mb-4 border border-blue-200/50">
                4
              </div>
              <h4 className="font-bold text-base text-gray-900 dark:text-white mb-1.5">Direct Chat</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Connect directly in real-time chats and get instant notification alerts.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. CALL TO ACTION: INSTAGRAM / FACEBOOK BANNER               */}
      {/* ============================================================ */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-teal-700 via-cyan-700 to-blue-800 text-white overflow-hidden shadow-2xl text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to see what your friends are up to?
            </h2>
            <p className="text-teal-100 text-base max-w-xl mx-auto">
              Join ConnectHub today for free. Share moments, connect with people, and chat instantly in a clean social space.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-teal-800 px-8 py-3.5 rounded-2xl font-bold text-base shadow-lg hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Sign Up Now — It&apos;s Free</span>
                <HiOutlineArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-800/60 hover:bg-teal-800/80 text-white border border-teal-400/40 px-7 py-3.5 rounded-2xl font-semibold text-base transition-all"
              >
                <span>Log In</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. SOCIAL FOOTER (INSTAGRAM/FACEBOOK STYLE)                  */}
      {/* ============================================================ */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-900 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
          
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-tr from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-extrabold text-xs">C</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white">ConnectHub</span>
            <span>© {new Date().getFullYear()}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-gray-600 dark:text-gray-400">
            <Link to="/register" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Sign Up</Link>
            <Link to="/login" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Log In</Link>
            <a href="#features" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Features</a>
            <Link to="/search" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Explore</Link>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Landing;
