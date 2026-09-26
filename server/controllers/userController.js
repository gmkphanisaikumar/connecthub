const User = require('../models/User');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

// ==========================================
// @route   GET /api/users/profile/:username
// @desc    Get a user's profile by username
// @access  Private
// ==========================================
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('followers', 'username fullName profilePicture')
      .populate('following', 'username fullName profilePicture');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get this user's posts
    const posts = await Post.find({ user: user._id })
      .populate('user', 'username fullName profilePicture')
      .populate('comments.user', 'username fullName profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      user,
      posts,
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==========================================
// @route   PUT /api/users/profile
// @desc    Update your own profile (bio, fullName, profilePicture, coverPicture)
// @access  Private
// ==========================================
const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, removeCover } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update text fields
    if (fullName !== undefined) user.fullName = fullName;
    if (bio !== undefined) user.bio = bio;

    // Handle uploaded files (multer fields or single file)
    if (req.files) {
      if (req.files.profilePicture && req.files.profilePicture[0]) {
        user.profilePicture = `/uploads/${req.files.profilePicture[0].filename}`;
      }
      if (req.files.coverPicture && req.files.coverPicture[0]) {
        user.coverPicture = `/uploads/${req.files.coverPicture[0].filename}`;
      }
    } else if (req.file) {
      if (req.file.fieldname === 'coverPicture') {
        user.coverPicture = `/uploads/${req.file.filename}`;
      } else {
        user.profilePicture = `/uploads/${req.file.filename}`;
      }
    }

    // Remove cover image if explicitly requested
    if (removeCover === 'true' || removeCover === true) {
      user.coverPicture = '';
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user,
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};


// ==========================================
// @route   PUT /api/users/follow/:id
// @desc    Follow or unfollow a user (toggle)
// @access  Private
// ==========================================
const toggleFollow = async (req, res) => {
  try {
    // Can't follow yourself
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You can't follow yourself",
      });
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isFollowing = currentUser.following.some(
      (id) => id.toString() === req.params.id
    );

    if (isFollowing) {
      // Unfollow: remove from both arrays
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== req.params.id
      );
      userToFollow.followers = userToFollow.followers.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      // Follow: add to both arrays
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user._id);
    }

    await currentUser.save();
    await userToFollow.save();

    // Create a follow notification (only when following, not unfollowing)
    if (!isFollowing) {
      await Notification.create({
        recipient: userToFollow._id,
        sender: req.user._id,
        type: 'follow',
        message: `${req.user.username} started following you`,
      });
    }

    res.status(200).json({
      success: true,
      message: isFollowing ? 'Unfollowed user' : 'Following user!',
      isFollowing: !isFollowing,
      followersCount: userToFollow.followers.length,
      followingCount: currentUser.following.length,
    });
  } catch (error) {
    console.error('Toggle Follow Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==========================================
// @route   GET /api/users/search?q=searchTerm
// @desc    Search users by username or full name
// @access  Private
// ==========================================
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    // Search by username OR fullName (case-insensitive)
    const users = await User.find({
      $or: [
        { username: { $regex: q.trim(), $options: 'i' } },
        { fullName: { $regex: q.trim(), $options: 'i' } },
      ],
      _id: { $ne: req.user._id }, // Exclude yourself from results
    })
      .select('username fullName profilePicture bio followers')
      .limit(20);

    res.status(200).json({
      success: true,
      users,
      count: users.length,
    });
  } catch (error) {
    console.error('Search Users Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==========================================
// @route   GET /api/users/suggestions
// @desc    Get suggested users to follow (not already following)
// @access  Private
// ==========================================
const getSuggestions = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    // Find users you're NOT following (exclude yourself too)
    const suggestions = await User.find({
      _id: {
        $nin: [...currentUser.following, req.user._id],
      },
    })
      .select('username fullName profilePicture bio followers')
      .limit(5);

    res.status(200).json({
      success: true,
      users: suggestions,
    });
  } catch (error) {
    console.error('Get Suggestions Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==========================================
// @route   PUT /api/users/password
// @desc    Change the logged-in user's password
// @access  Private
// ==========================================
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    // Fetch user WITH password (excluded by default)
    const user = await User.findById(req.user._id).select('+password');

    // Verify current password is correct
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Set new password (pre-save hook will hash it automatically)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully!',
    });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  toggleFollow,
  searchUsers,
  getSuggestions,
  changePassword,
};
