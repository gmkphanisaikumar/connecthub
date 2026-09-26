import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api, { getImageUrl } from '../../utils/api';
import toast from 'react-hot-toast';
import {
  HiOutlineHeart,
  HiHeart,
  HiOutlineChatAlt,
  HiOutlineBookmark,
  HiBookmark,
  HiOutlineShare,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineDotsHorizontal,
  HiOutlineCheck,
} from 'react-icons/hi';

const PostCard = ({ post, onPostUpdated, onPostDeleted }) => {
  const { user, setUser } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post?.text || '');
  const [showMenu, setShowMenu] = useState(false);
  const [likes, setLikes] = useState(post?.likes || []);
  const [comments, setComments] = useState(post?.comments || []);
  const [shares, setShares] = useState(post?.shares || []);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const isOwner = user?._id === (post?.user?._id || post?.user);
  const isLiked = likes.some((id) => id === user?._id || id?._id === user?._id);
  
  // Check if post is saved in user's savedPosts array
  const isSaved = user?.savedPosts?.some((item) => {
    const savedId = typeof item === 'string' ? item : item?._id;
    return savedId === post?._id;
  });

  // Format the date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // ===== Like / Unlike =====
  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await api.put(`/posts/${post._id}/like`);
      setLikes(res.data.likes);
    } catch {
      toast.error('Failed to update like status');
    } finally {
      setIsLiking(false);
    }
  };

  // ===== Save / Unsave =====
  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const res = await api.put(`/posts/${post._id}/save`);
      if (user) {
        const updatedSaved = res.data.savedPosts || [];
        const updatedUser = { ...user, savedPosts: updatedSaved };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      toast.success(res.data.isSaved ? 'Saved to collection! 🔖' : 'Removed from saved collection');
    } catch {
      toast.error('Failed to update saved status');
    } finally {
      setIsSaving(false);
    }
  };

  // ===== Share Post =====
  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      const res = await api.put(`/posts/${post._id}/share`);
      setShares(res.data.post?.shares || [...shares, user._id]);

      // Copy shareable link
      const shareUrl = `${window.location.origin}/profile/${post.user?.username || ''}`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
      toast.success('Post shared! Profile link copied to clipboard 📋');
    } catch {
      toast.error('Failed to share post');
    } finally {
      setIsSharing(false);
    }
  };

  // ===== Edit Post =====
  const handleEdit = async () => {
    if (!editText.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }
    try {
      const res = await api.put(`/posts/${post._id}`, { text: editText.trim() });
      setIsEditing(false);
      if (onPostUpdated) onPostUpdated(res.data.post);
      toast.success('Post updated successfully!');
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
      toast.success('Post deleted successfully');
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
      setComments(res.data.post?.comments || []);
      setCommentText('');
      toast.success('Comment added!');
    } catch {
      toast.error('Failed to add comment');
    }
  };

  // ===== Delete Comment =====
  const handleDeleteComment = async (commentId) => {
    try {
      const res = await api.delete(`/posts/${post._id}/comment/${commentId}`);
      setComments(res.data.post?.comments || []);
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <article className="card mb-5 hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
      {/* ===== Post Header ===== */}
      <div className="flex items-center justify-between mb-3.5 px-1">
        <Link
          to={`/profile/${post.user?.username}`}
          className="flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 bg-gradient-to-br from-teal-400 via-cyan-500 to-emerald-400 rounded-full flex items-center justify-center shadow-md shadow-cyan-500/15 ring-2 ring-transparent group-hover:ring-cyan-400/40 transition-all overflow-hidden shrink-0">
            {post.user?.profilePicture ? (
              <img
                src={getImageUrl(post.user.profilePicture)}
                alt={post.user.username}
                className="w-11 h-11 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-base">
                {(post.user?.username?.[0] || 'U').toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900 dark:text-white text-[15px] group-hover:text-primary-600 transition-colors">
                {post.user?.fullName || post.user?.username || 'ConnectHub User'}
              </h4>
              <span className="text-xs text-primary-500 font-medium px-2 py-0.5 bg-primary-50 dark:bg-primary-950/40 rounded-full border border-primary-200/50 dark:border-primary-800/40">
                Member
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              @{post.user?.username} · <span>{formatDate(post.createdAt)}</span>
            </p>
          </div>
        </Link>

        {/* Post menu (edit/delete) — only for post owner */}
        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              title="Post Options"
            >
              <HiOutlineDotsHorizontal className="text-xl" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    <HiOutlinePencil className="text-lg text-teal-500" /> Edit Post
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-medium"
                  >
                    <HiOutlineTrash className="text-lg text-red-500" /> Delete Post
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ===== Post Caption & Text ===== */}
      {isEditing ? (
        <div className="mb-4">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="input-field text-sm"
            rows={3}
            maxLength={1500}
          />
          <div className="flex gap-2 mt-2.5">
            <button onClick={handleEdit} className="btn-primary text-xs px-4 py-1.5 font-medium">
              Save Changes
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditText(post.text);
              }}
              className="btn-secondary text-xs px-4 py-1.5 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        post.text && (
          <p className="text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed mb-3.5 whitespace-pre-wrap px-1">
            {post.text}
          </p>
        )
      )}

      {/* ===== Post Image (Full display with clean framing) ===== */}
      {post.image && (
        <div className="rounded-xl overflow-hidden mb-3.5 border border-gray-100 dark:border-gray-800 bg-gray-950 flex items-center justify-center max-h-[520px]">
          <img
            src={getImageUrl(post.image)}
            alt="Post content"
            className="w-full h-full max-h-[520px] object-contain rounded-xl hover:scale-[1.01] transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}

      {/* ===== Engagement Stats Bar ===== */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3 px-1 border-b border-gray-100 dark:border-gray-800/60 pb-2.5">
        <div className="flex items-center gap-3">
          {likes.length > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px]">♥</span>
              <span className="font-semibold text-gray-700 dark:text-gray-300">{likes.length}</span>
              <span>{likes.length === 1 ? 'like' : 'likes'}</span>
            </span>
          )}
          {shares.length > 0 && (
            <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400">
              <span className="font-semibold">{shares.length}</span>
              <span>{shares.length === 1 ? 'share' : 'shares'}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:text-primary-600 transition-colors font-medium"
          >
            {comments.length > 0
              ? `${comments.length} ${comments.length === 1 ? 'comment' : 'comments'}`
              : '0 comments'}
          </button>
        </div>
      </div>

      {/* ===== 4 Core Action Buttons: Like, Comment, Share, Save ===== */}
      <div className="grid grid-cols-4 gap-1 pt-1 border-t border-gray-100 dark:border-gray-800/80">
        {/* 1. Like Button */}
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
            isLiked
              ? 'text-red-500 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          title={isLiked ? 'Unlike' : 'Like'}
        >
          {isLiked ? (
            <HiHeart className="text-xl text-red-500" />
          ) : (
            <HiOutlineHeart className="text-xl" />
          )}
          <span className="hidden sm:inline">{isLiked ? 'Liked' : 'Like'}</span>
        </button>

        {/* 2. Comment Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
            showComments
              ? 'text-teal-600 bg-teal-50 dark:bg-teal-950/30'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          title="Comment"
        >
          <HiOutlineChatAlt className="text-xl" />
          <span className="hidden sm:inline">Comment</span>
        </button>

        {/* 3. Share Button */}
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          title="Share Post & Copy Link"
        >
          {copied ? (
            <HiOutlineCheck className="text-xl text-cyan-500" />
          ) : (
            <HiOutlineShare className="text-xl" />
          )}
          <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
        </button>

        {/* 4. Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
            isSaved
              ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          title={isSaved ? 'Remove from Saved' : 'Save Post'}
        >
          {isSaved ? (
            <HiBookmark className="text-xl text-amber-500" />
          ) : (
            <HiOutlineBookmark className="text-xl" />
          )}
          <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      {/* ===== Comments Section ===== */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          {/* Comment input form */}
          <form onSubmit={handleComment} className="flex gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 via-cyan-500 to-emerald-400 rounded-full flex items-center justify-center shrink-0 shadow-sm">
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
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {comments.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
                No comments yet. Start the conversation! 💬
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex gap-3 group items-start"
                >
                  <Link to={`/profile/${comment.user?.username}`}>
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
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
                    <div className="bg-gray-50 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-2.5">
                      <Link
                        to={`/profile/${comment.user?.username}`}
                        className="text-xs font-bold text-gray-900 dark:text-white hover:text-primary-600 transition-colors"
                      >
                        {comment.user?.fullName || comment.user?.username}
                      </Link>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5 whitespace-pre-wrap">
                        {comment.text}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 px-2">
                      <span className="text-[11px] text-gray-400">
                        {formatDate(comment.createdAt)}
                      </span>
                      {(comment.user?._id === user?._id || comment.user === user?._id || isOwner) && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-[11px] text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all font-medium"
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
    </article>
  );
};

export default PostCard;

