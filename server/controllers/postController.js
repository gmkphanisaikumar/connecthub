const Post = require('../models/Post');
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
      .populate('comments.user', 'username fullName profilePicture');

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
// @route   GET /api/posts/:id
// @desc    Get a single post by ID
// @access  Private
// ==========================================
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username fullName profilePicture')
      .populate('comments.user', 'username fullName profilePicture');

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
      .populate('comments.user', 'username fullName profilePicture');

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
      .populate('comments.user', 'username fullName profilePicture');

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
      .populate('comments.user', 'username fullName profilePicture');

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
  getPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
};
