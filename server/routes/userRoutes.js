const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  toggleFollow,
  searchUsers,
  getSuggestions,
  changePassword,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All user routes require authentication
router.use(protect);

// Search & suggestions (must be ABOVE /:username to avoid conflicts)
router.get('/search', searchUsers);
router.get('/suggestions', getSuggestions);

// Profile routes
router.get('/profile/:username', getUserProfile);
router.put('/profile', upload.single('profilePicture'), updateProfile);

// Follow/Unfollow
router.put('/follow/:id', toggleFollow);

// Password change
router.put('/password', changePassword);

module.exports = router;
