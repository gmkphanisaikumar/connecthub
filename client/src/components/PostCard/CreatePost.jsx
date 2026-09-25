import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { HiOutlinePhotograph, HiOutlineX, HiOutlineEmojiHappy } from 'react-icons/hi';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setImage(file);
      // Create a preview URL to show the image before uploading
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

  // Submit the post
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim() && !image) {
      toast.error('Write something or add an image');
      return;
    }

    setIsLoading(true);

    try {
      // Use FormData because we might be sending a file
      const formData = new FormData();
      formData.append('text', text.trim());
      if (image) {
        formData.append('image', image);
      }

      const res = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Post created! 🎉');
      setText('');
      removeImage();

      // Tell the parent component about the new post
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
    <div className="card mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          {/* User avatar */}
          <div className="w-11 h-11 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center shrink-0 shadow-md shadow-primary-500/15">
            {user?.profilePicture ? (
              <img
                src={`http://localhost:5000${user.profilePicture}`}
                alt={user.username}
                className="w-11 h-11 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-bold">
                {(user?.username?.[0] || 'U').toUpperCase()}
              </span>
            )}
          </div>

          {/* Text input */}
          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`What's on your mind, ${user?.fullName?.split(' ')[0] || user?.username}?`}
              className="w-full resize-none border-0 bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-[15px] leading-relaxed"
              rows={2}
              maxLength={1000}
            />

            {/* Image preview */}
            {imagePreview && (
              <div className="relative mt-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-72 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-gray-900/70 hover:bg-gray-900/90 text-white rounded-full transition-colors"
                >
                  <HiOutlineX className="text-lg" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            {/* Image upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl transition-colors"
            >
              <HiOutlinePhotograph className="text-xl text-green-500" />
              <span className="hidden sm:inline">Photo</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-600 rounded-xl transition-colors"
            >
              <HiOutlineEmojiHappy className="text-xl text-yellow-500" />
              <span className="hidden sm:inline">Feeling</span>
            </button>
          </div>

          {/* Post button */}
          <button
            type="submit"
            disabled={isLoading || (!text.trim() && !image)}
            className="btn-primary text-sm px-6 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Posting...
              </span>
            ) : (
              'Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
