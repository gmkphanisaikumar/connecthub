const express = require('express');
const router = express.Router();
const {
  createPost,
  getFeedPosts,
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

// CRUD routes
router.post('/', upload.single('image'), createPost);      // Create post (with optional image)
router.get('/feed', getFeedPosts);                          // Get feed
router.get('/:id', getPost);                                // Get single post
router.put('/:id', upload.single('image'), updatePost);     // Edit post
router.delete('/:id', deletePost);                          // Delete post

// Like & Comment routes
router.put('/:id/like', toggleLike);                        // Like/Unlike
router.post('/:id/comment', addComment);                    // Add comment
router.delete('/:id/comment/:commentId', deleteComment);    // Delete comment

module.exports = router;
