import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api, { getImageUrl } from '../../utils/api';
import toast from 'react-hot-toast';
import {
  HiOutlinePhotograph,
  HiOutlineX,
  HiOutlineEmojiHappy,
  HiOutlineSparkles,
} from 'react-icons/hi';

const FEELINGS_LIST = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '🚀', label: 'Motivated' },
  { emoji: '💡', label: 'Inspired' },
  { emoji: '🎉', label: 'Excited' },
  { emoji: '☕', label: 'Relaxed' },
  { emoji: '💻', label: 'Coding' },
  { emoji: '🌟', label: 'Blessed' },
  { emoji: '📚', label: 'Learning' },
  { emoji: '🔥', label: 'Energized' },
  { emoji: '❤️', label: 'Loved' },
  { emoji: '🎯', label: 'Focused' },
  { emoji: '🤩', label: 'Awesome' },
];

const QUICK_EMOJIS = ['😊', '🔥', '🚀', '❤️', '💡', '🎉', '✨', '👏', '💯', '🤩', '😎', '🙌'];

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFeeling, setSelectedFeeling] = useState(null);
  const [showFeelingPicker, setShowFeelingPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const pickerRef = useRef(null);

  // Close feeling picker on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowFeelingPicker(false);
      }
    };
    if (showFeelingPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFeelingPicker]);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Remove selected image
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Insert emoji into textarea
  const insertEmoji = (emoji) => {
    setText((prev) => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + emoji);
  };

  // Select feeling
  const handleSelectFeeling = (item) => {
    setSelectedFeeling(item);
    setShowFeelingPicker(false);
  };

  // Submit the post
  const handleSubmit = async (e) => {
    e.preventDefault();

    let fullPostText = text.trim();
    if (selectedFeeling) {
      const feelingTag = `— feeling ${selectedFeeling.emoji} ${selectedFeeling.label}`;
      fullPostText = fullPostText ? `${fullPostText}\n\n${feelingTag}` : feelingTag;
    }

    if (!fullPostText && !image) {
      toast.error('Write something, choose a feeling, or add an image');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('text', fullPostText);
      if (image) {
        formData.append('image', image);
      }

      const res = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Post published! 🎉');
      setText('');
      setSelectedFeeling(null);
      removeImage();

      if (onPostCreated) {
        onPostCreated(res.data.post);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card mb-6 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3.5">
          {/* User avatar */}
          <div className="w-11 h-11 bg-gradient-to-br from-teal-400 via-cyan-500 to-emerald-400 rounded-full flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/15 overflow-hidden ring-2 ring-cyan-400/20">
            {user?.profilePicture ? (
              <img
                src={getImageUrl(user.profilePicture)}
                alt={user.username}
                className="w-11 h-11 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-base">
                {(user?.username?.[0] || 'U').toUpperCase()}
              </span>
            )}
          </div>

          {/* Text input area */}
          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`What's on your mind, ${user?.fullName?.split(' ')[0] || user?.username}?`}
              className="w-full resize-none border-0 bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-[15px] leading-relaxed"
              rows={2}
              maxLength={1500}
            />

            {/* Feeling Badge Preview */}
            {selectedFeeling && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800/50 rounded-full text-xs font-semibold mb-3">
                <span>{selectedFeeling.emoji}</span>
                <span>Feeling {selectedFeeling.label}</span>
                <button
                  type="button"
                  onClick={() => setSelectedFeeling(null)}
                  className="hover:text-red-500 transition-colors ml-1"
                  title="Remove feeling"
                >
                  <HiOutlineX className="text-sm" />
                </button>
              </div>
            )}

            {/* Image preview */}
            {imagePreview && (
              <div className="relative mt-2 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-950 flex items-center justify-center max-h-80">
                <img
                  src={imagePreview}
                  alt="Upload Preview"
                  className="w-full max-h-80 object-contain rounded-xl"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-gray-900/80 hover:bg-gray-900 text-white rounded-full transition-colors shadow-lg"
                  title="Remove image"
                >
                  <HiOutlineX className="text-lg" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 relative">
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Image upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-teal-600 dark:hover:text-teal-400 rounded-xl transition-colors"
            >
              <HiOutlinePhotograph className="text-xl text-teal-500" />
              <span className="hidden sm:inline">Photo</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Feeling / Emoji Button with Dropdown */}
            <div className="relative" ref={pickerRef}>
              <button
                type="button"
                onClick={() => setShowFeelingPicker(!showFeelingPicker)}
                className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition-colors ${
                  showFeelingPicker || selectedFeeling
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600'
                }`}
                title="Add feeling or emoji"
              >
                <HiOutlineEmojiHappy className="text-xl text-amber-500" />
                <span className="hidden sm:inline">
                  {selectedFeeling ? `${selectedFeeling.emoji} ${selectedFeeling.label}` : 'Feeling / Activity'}
                </span>
              </button>

              {/* Feelings & Emojis Popover Modal */}
              {showFeelingPicker && (
                <div className="absolute left-0 bottom-full mb-2 w-72 sm:w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-4 z-30 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <HiOutlineSparkles className="text-amber-500" /> How are you feeling?
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowFeelingPicker(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <HiOutlineX className="text-sm" />
                    </button>
                  </div>

                  {/* Feelings Grid */}
                  <div className="grid grid-cols-3 gap-1.5 mb-3 max-h-44 overflow-y-auto">
                    {FEELINGS_LIST.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => handleSelectFeeling(item)}
                        className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-medium transition-all ${
                          selectedFeeling?.label === item.label
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span className="text-base">{item.emoji}</span>
                        <span className="truncate">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Quick Emojis Bar */}
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-[11px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                      Quick Emoji Insert
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => insertEmoji(emoji)}
                          className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg hover:scale-110 active:scale-95 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Post button */}
          <button
            type="submit"
            disabled={isLoading || (!text.trim() && !image && !selectedFeeling)}
            className="btn-primary text-xs sm:text-sm px-5 py-2 font-semibold shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Publishing...
              </span>
            ) : (
              'Publish Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;

