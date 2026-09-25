import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api, { getImageUrl } from '../../utils/api';
import toast from 'react-hot-toast';
import {
  HiOutlineHeart,
  HiHeart,
  HiOutlineChatAlt,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineDotsHorizontal,
  HiOutlineX,
} from 'react-icons/hi';

const PostCard = ({ post, onPostUpdated, onPostDeleted }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);
  const [showMenu, setShowMenu] = useState(false);
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [isLiking, setIsLiking] = useState(false);

  const isOwner = user?._id === post.user?._id;
  const isLiked = likes.some((id) => id === user?._id || id._id === user?._id);

  // Format the date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // ===== Like / Unlike =====
  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await api.put(`/posts/${post._id}/like`);
      setLikes(res.data.likes);
    } catch {
      toast.error('Failed to like post');
    } finally {
      setIsLiking(false);
    }
  };

  // ===== Edit Post =====
  const handleEdit = async () => {
    if (!editText.trim()) {
      toast.error('Post cannot be empty');
      return;
    }
    try {
      const res = await api.put(`/posts/${post._id}`, { text: editText.trim() });
      setIsEditing(false);
      if (onPostUpdated) onPostUpdated(res.data.post);
      toast.success('Post updated!');
    } catch {
      toast.error('Failed to update post');
    }
  };

  // ===== Delete Post =====
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/posts/${post._id}`);
      if (onPostDeleted) onPostDeleted(post._id);
      toast.success('Post deleted');
    } catch {
      toast.error('Failed to delete post');
    }
  };

  // ===== Add Comment =====
  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await api.post(`/posts/${post._id}/comment`, {
        text: commentText.trim(),
      });
      setComments(res.data.post.comments);
      setCommentText('');
    } catch {
      toast.error('Failed to add comment');
    }
  };

  // ===== Delete Comment =====
  const handleDeleteComment = async (commentId) => {
    try {
      const res = await api.delete(`/posts/${post._id}/comment/${commentId}`);
      setComments(res.data.post.comments);
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="card mb-4 hover:shadow-md transition-shadow duration-200">
      {/* ===== Post Header ===== */}
      <div className="flex items-start justify-between mb-3">
        <Link
          to={`/profile/${post.user?.username}`}
          className="flex items-center gap-3 group"
        >
          <div className="w-11 h-11 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center shadow-md shadow-primary-500/15">
            {post.user?.profilePicture ? (
              <img
                src={getImageUrl(post.user.profilePicture)}
                alt={post.user.username}
                className="w-11 h-11 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-bold">
                {(post.user?.username?.[0] || 'U').toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-[15px] group-hover:text-primary-600 transition-colors">
              {post.user?.fullName || post.user?.username}
            </h4>
            <p className="text-xs text-gray-400">
              @{post.user?.username} · {formatDate(post.createdAt)}
            </p>
          </div>
        </Link>

        {/* Post menu (edit/delete) — only for post owner */}
        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <HiOutlineDotsHorizontal className="text-xl" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-20">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <HiOutlinePencil className="text-lg" /> Edit Post
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <HiOutlineTrash className="text-lg" /> Delete Post
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ===== Post Content ===== */}
      {isEditing ? (
        <div className="mb-3">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="input-field text-sm"
            rows={3}
            maxLength={1000}
          />
          <div className="flex gap-2 mt-2">
            <button onClick={handleEdit} className="btn-primary text-xs px-4 py-1.5">
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditText(post.text);
              }}
              className="btn-secondary text-xs px-4 py-1.5"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        post.text && (
          <p className="text-gray-800 dark:text-gray-200 text-[15px] leading-relaxed mb-3 whitespace-pre-wrap">
            {post.text}
          </p>
        )
      )}

      {/* Post Image */}
      {post.image && (
        <div className="rounded-xl overflow-hidden mb-3 border border-gray-100 dark:border-gray-800">
          <img
            src={getImageUrl(post.image)}
            alt="Post"
            className="w-full max-h-96 object-cover"
          />
        </div>
      )}

      {/* ===== Like & Comment Counts ===== */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3 px-1">
        <span>
          {likes.length > 0 && (
            <>
              <span className="text-red-500">♥</span> {likes.length}{' '}
              {likes.length === 1 ? 'like' : 'likes'}
            </>
          )}
        </span>
        <button
          onClick={() => setShowComments(!showComments)}
          className="hover:text-primary-600 transition-colors"
        >
          {comments.length > 0 &&
            `${comments.length} ${comments.length === 1 ? 'comment' : 'comments'}`}
        </button>
      </div>

      {/* ===== Action Buttons ===== */}
      <div className="flex items-center border-t border-gray-100 dark:border-gray-800 pt-3 gap-1">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            isLiked
              ? 'text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          {isLiked ? (
            <HiHeart className="text-xl" />
          ) : (
            <HiOutlineHeart className="text-xl" />
          )}
          <span>{isLiked ? 'Liked' : 'Like'}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <HiOutlineChatAlt className="text-xl" />
          <span>Comment</span>
        </button>
      </div>

      {/* ===== Comments Section ===== */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          {/* Comment input */}
          <form onSubmit={handleComment} className="flex gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">
                {(user?.username?.[0] || 'U').toUpperCase()}
              </span>
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="input-field text-sm py-2"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="btn-primary text-xs px-4 py-2 disabled:opacity-40"
              >
                Post
              </button>
            </div>
          </form>

          {/* Comments list */}
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-3">
                No comments yet. Be the first! 💬
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex gap-3 group"
                >
                  <Link to={`/profile/${comment.user?.username}`}>
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center shrink-0">
                      {comment.user?.profilePicture ? (
                        <img
                          src={getImageUrl(comment.user.profilePicture)}
                          alt={comment.user.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-xs font-bold">
                          {(comment.user?.username?.[0] || 'U').toUpperCase()}
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="flex-1">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5">
                      <Link
                        to={`/profile/${comment.user?.username}`}
                        className="text-sm font-semibold text-gray-900 dark:text-white hover:text-primary-600 transition-colors"
                      >
                        {comment.user?.fullName || comment.user?.username}
                      </Link>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                        {comment.text}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 px-2">
                      <span className="text-xs text-gray-400">
                        {formatDate(comment.createdAt)}
                      </span>
                      {(comment.user?._id === user?._id || isOwner) && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-xs text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
