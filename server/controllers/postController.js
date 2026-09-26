const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');

// ==========================================
// @route   POST /api/posts
// @desc    Create a new post (with optional image)
// @access  Private
// ==========================================
const createPost = async (req, res) => {
  try {
    const { text } = req.body;

    // Must have either text or image
    if (!text && !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Post must have text or an image',
      });
    }

    const postData = {
      user: req.user._id,
      text: text || '',
    };

    // If an image was uploaded, store its path
    if (req.file) {
      postData.image = `/uploads/${req.file.filename}`;
    }

    const post = await Post.create(postData);

    // Populate user info before sending response
    const populatedPost = await Post.findById(post._id)
      .populate('user', 'username fullName profilePicture')
      .populate('comments.user', 'username fullName profilePicture')
      .populate('shares', 'username fullName profilePicture');

    res.status(201).json({
      success: true,
      message: 'Post created!',
      post: populatedPost,
    });
  } catch (error) {
    console.error('Create Post Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==========================================
// @route   GET /api/posts/feed
// @desc    Get all posts for the home feed (newest first)
// @access  Private
// ==========================================
const getFeedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('user', 'username fullName profilePicture')
      .populate('comments.user', 'username fullName profilePicture')
      .populate('shares', 'username fullName profilePicture')
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.status(200).json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get Feed Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==========================================
// @route   GET /api/posts/trending
// @desc    Get posts with the highest engagement (likes, comments, shares)
// @access  Private
// ==========================================
const getTrendingPosts = async (req, res) => {
  try {
    // Fetch all posts with populated fields
    const allPosts = await Post.find()
      .populate('user', 'username fullName profilePicture')
      .populate('comments.user', 'username fullName profilePicture')
      .populate('shares', 'username fullName profilePicture');

    // Score each post based on real engagement
    // Likes: weight 3, Comments: weight 2, Shares: weight 4
    const scoredPosts = allPosts.map((post) => {
      const likesCount = post.likes ? post.likes.length : 0;
      const commentsCount = post.comments ? post.comments.length : 0;
      const sharesCount = post.shares ? post.shares.length : 0;

      // Engagement score
      const engagementScore = likesCount * 3 + commentsCount * 2 + sharesCount * 4;

      return {
        post,
        engagementScore,
        likesCount,
        commentsCount,
        sharesCount,
      };
    });

    // Filter to posts with actual engagement first, or sort by engagement score descending
    scoredPosts.sort((a, b) => {
      if (b.engagementScore !== a.engagementScore) {
        return b.engagementScore - a.engagementScore;
      }
      return new Date(b.post.createdAt) - new Date(a.post.createdAt);
    });

    // Return the top trending posts
    const trendingPosts = scoredPosts.map((item) => item.post);

    res.status(200).json({
      success: true,
      posts: trendingPosts,
      totalTrending: trendingPosts.length,
    });
  } catch (error) {
    console.error('Get Trending Posts Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==========================================
// @route   GET /api/posts/saved
// @desc    Get all saved posts for the logged-in user
// @access  Private
// ==========================================
const getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.savedPosts || user.savedPosts.length === 0) {
      return res.status(200).json({
        success: true,
        posts: [],
      });
    }

    // Find all posts that are in the user's savedPosts array
    const savedPosts = await Post.find({ _id: { $in: user.savedPosts } })
      .populate('user', 'username fullName profilePicture')
      .populate('comments.user', 'username fullName profilePicture')
      .populate('shares', 'username fullName profilePicture');

    // Preserve the order of savedPosts (newest saved first)
    const savedMap = new Map(savedPosts.map((p) => [p._id.toString(), p]));
    const orderedPosts = user.savedPosts
      .map((id) => savedMap.get(id.toString()))
      .filter(Boolean)
      .reverse();

    res.status(200).json({
      success: true,
      posts: orderedPosts,
    });
  } catch (error) {
    console.error('Get Saved Posts Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==========================================
// @route   PUT /api/posts/:id/save
// @desc    Save or unsave a post for current user (toggle)
// @access  Private
// ==========================================
const toggleSavePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const user = await User.findById(req.user._id);
    if (!user.savedPosts) {
      user.savedPosts = [];
    }

    const isAlreadySaved = user.savedPosts.some(
      (id) => id.toString() === postId.toString()
    );

    if (isAlreadySaved) {
      // Remove from saved posts
      user.savedPosts = user.savedPosts.filter(
        (id) => id.toString() !== postId.toString()
      );
    } else {
      // Add to saved posts
      user.savedPosts.push(postId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: isAlreadySaved ? 'Post removed from saved' : 'Post saved successfully!',
      isSaved: !isAlreadySaved,
      savedPosts: user.savedPosts,
    });
  } catch (error) {
    console.error('Toggle Save Post Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==========================================
// @route   PUT /api/posts/:id/share
// @desc    Share a post (increments share count & adds user to shares)
// @access  Private
// ==========================================
const sharePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (!post.shares) {
      post.shares = [];
    }

    const userId = req.user._id.toString();
    const alreadyShared = post.shares.some((id) => id.toString() === userId);

    if (!alreadyShared) {
      post.shares.push(req.user._id);
      await post.save();

      // Notify post owner if sharing someone else's post
      if (post.user.toString() !== userId) {
        await Notification.create({
          recipient: post.user,
          sender: req.user._id,
          type: 'share',
          post: post._id,
          message: `${req.user.username} shared your post`,
        });
      }
    }

    const updatedPost = await Post.findById(post._id)
      .populate('user', 'username fullName profilePicture')
      .populate('comments.user', 'username fullName profilePicture')
      .populate('shares', 'username fullName profilePicture');

    res.status(200).json({
      success: true,
      message: 'Post shared successfully!',
      post: updatedPost,
      sharesCount: updatedPost.shares.length,
    });
  } catch (error) {
    console.error('Share Post Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==========================================
// @route   GET /api/posts/analytics
// @desc    Get real user analytics based on actual database records
// @access  Private
// ==========================================
const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // 1. Fetch all posts created by this user
    const userPosts = await Post.find({ user: userId })
      .populate('comments.user', 'username fullName profilePicture')
      .populate('shares', 'username fullName profilePicture')
      .sort({ createdAt: -1 });

    // 2. Compute aggregate totals
    const totalPosts = userPosts.length;
    let totalLikes = 0;
    let totalComments = 0;
    let totalShares = 0;

    userPosts.forEach((p) => {
      totalLikes += p.likes ? p.likes.length : 0;
      totalComments += p.comments ? p.comments.length : 0;
      totalShares += p.shares ? p.shares.length : 0;
    });

    const totalSaved = user.savedPosts ? user.savedPosts.length : 0;
    const followersCount = user.followers ? user.followers.length : 0;
    const followingCount = user.following ? user.following.length : 0;

    // 3. Compute Engagement Metric
    const totalInteractions = totalLikes + totalComments + totalShares;
    const avgInteractionsPerPost = totalPosts > 0 ? (totalInteractions / totalPosts).toFixed(1) : '0';
    const engagementRate =
      followersCount > 0
        ? ((totalInteractions / (followersCount * Math.max(totalPosts, 1))) * 100).toFixed(1)
        : totalPosts > 0
        ? (totalInteractions / totalPosts).toFixed(1)
        : '0';

    // 4. Rank user's most engaged posts
    const rankedUserPosts = [...userPosts].sort((a, b) => {
      const aScore = (a.likes?.length || 0) * 3 + (a.comments?.length || 0) * 2 + (a.shares?.length || 0) * 4;
      const bScore = (b.likes?.length || 0) * 3 + (b.comments?.length || 0) * 2 + (b.shares?.length || 0) * 4;
      return bScore - aScore;
    });

    const mostEngagedPosts = rankedUserPosts.slice(0, 5);

    // 5. Compute recent activity breakdown
    const recentActivity = userPosts.slice(0, 8).map((p) => ({
      _id: p._id,
      text: p.text,
      image: p.image,
      likesCount: p.likes?.length || 0,
      commentsCount: p.comments?.length || 0,
      sharesCount: p.shares?.length || 0,
      createdAt: p.createdAt,
    }));

    res.status(200).json({
      success: true,
      analytics: {
        totalPosts,
        totalLikes,
        totalComments,
        totalShares,
        totalSaved,
        followersCount,
        followingCount,
        totalInteractions,
        avgInteractionsPerPost,
        engagementRate,
        mostEngagedPosts,
        recentActivity,
      },
    });
  } catch (error) {
    console.error('Get User Analytics Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==========================================
// @route   GET /api/posts/:id
// @desc    Get a single post by ID
// @access  Private
// ==========================================
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username fullName profilePicture')
      .populate('comments.user', 'username fullName profilePicture')
      .populate('shares', 'username fullName profilePicture');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.status(200).json({ success: true, post });
  } catch (error) {
    console.error('Get Post Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==========================================
// @route   PUT /api/posts/:id
// @desc    Edit a post (only the author can edit)
// @access  Private
// ==========================================
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check if the logged-in user is the author
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own posts',
      });
    }

    // Update text
    if (req.body.text !== undefined) {
      post.text = req.body.text;
    }

    // Update image if new one uploaded
    if (req.file) {
      post.image = `/uploads/${req.file.filename}`;
    }

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('user', 'username fullName profilePicture')
      .populate('comments.user', 'username fullName profilePicture')
      .populate('shares', 'username fullName profilePicture');

    res.status(200).json({
      success: true,
      message: 'Post updated!',
      post: updatedPost,
    });
  } catch (error) {
    console.error('Update Post Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==========================================
// @route   DELETE /api/posts/:id
// @desc    Delete a post (only the author can delete)
// @access  Private
// ==========================================
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check ownership
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own posts',
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Post deleted!',
      postId: req.params.id,
    });
  } catch (error) {
    console.error('Delete Post Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==========================================
// @route   PUT /api/posts/:id/like
// @desc    Like or unlike a post (toggle)
// @access  Private
// ==========================================
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const userId = req.user._id.toString();
    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      // Unlike: remove user ID from likes array
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like: add user ID to likes array
      post.likes.push(req.user._id);
    }

    await post.save();

    // Create a notification for the post owner (but not if you liked your own post)
    if (!alreadyLiked && post.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: post.user,
        sender: req.user._id,
        type: 'like',
        post: post._id,
        message: `${req.user.username} liked your post`,
      });
    }

    res.status(200).json({
      success: true,
      message: alreadyLiked ? 'Post unliked' : 'Post liked!',
      likes: post.likes,
    });
  } catch (error) {
    console.error('Toggle Like Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==========================================
// @route   POST /api/posts/:id/comment
// @desc    Add a comment to a post
// @access  Private
// ==========================================
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required',
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.comments.push({
      user: req.user._id,
      text: text.trim(),
    });

    await post.save();

    // Notify post owner (not if commenting on own post)
    if (post.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: post.user,
        sender: req.user._id,
        type: 'comment',
        post: post._id,
        message: `${req.user.username} commented on your post`,
      });
    }

    // Return the updated post with populated comments
    const updatedPost = await Post.findById(post._id)
      .populate('user', 'username fullName profilePicture')
      .populate('comments.user', 'username fullName profilePicture')
      .populate('shares', 'username fullName profilePicture');

    res.status(201).json({
      success: true,
      message: 'Comment added!',
      post: updatedPost,
    });
  } catch (error) {
    console.error('Add Comment Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==========================================
// @route   DELETE /api/posts/:id/comment/:commentId
// @desc    Delete a comment (author of comment or post owner)
// @access  Private
// ==========================================
const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Only the comment author or post owner can delete
    const userId = req.user._id.toString();
    if (comment.user.toString() !== userId && post.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment',
      });
    }

    post.comments.pull({ _id: req.params.commentId });
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('user', 'username fullName profilePicture')
      .populate('comments.user', 'username fullName profilePicture')
      .populate('shares', 'username fullName profilePicture');

    res.status(200).json({
      success: true,
      message: 'Comment deleted!',
      post: updatedPost,
    });
  } catch (error) {
    console.error('Delete Comment Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createPost,
  getFeedPosts,
  getTrendingPosts,
  getSavedPosts,
  toggleSavePost,
  sharePost,
  getUserAnalytics,
  getPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
};

