const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All post routes are protected (require login)
router.use(protect);

// Specialized query routes (must be placed before /:id)
router.get('/feed', getFeedPosts);                          // Get newest feed posts
router.get('/trending', getTrendingPosts);                  // Get high-engagement trending posts
router.get('/saved', getSavedPosts);                        // Get user's saved posts
router.get('/analytics', getUserAnalytics);                 // Get user's real database analytics

// CRUD routes
router.post('/', upload.single('image'), createPost);      // Create post (with optional image)
router.get('/:id', getPost);                                // Get single post by ID
router.put('/:id', upload.single('image'), updatePost);     // Edit post
router.delete('/:id', deletePost);                          // Delete post

// Interaction routes
router.put('/:id/like', toggleLike);                        // Like/Unlike toggle
router.put('/:id/save', toggleSavePost);                    // Save/Unsave toggle
router.put('/:id/share', sharePost);                        // Share post
router.post('/:id/comment', addComment);                    // Add comment
router.delete('/:id/comment/:commentId', deleteComment);    // Delete comment

module.exports = router;

