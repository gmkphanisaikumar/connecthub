const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'connecthub_super_secret_key_2024';

// Helper: Generate a JWT token for a user
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  });
};

// ==========================================
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
// ==========================================
const register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    // 1. Check if user already exists (by email or username)
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.email === email
            ? 'Email already registered'
            : 'Username already taken',
      });
    }

    // 2. Create the new user (password is hashed automatically by the pre-save hook)
    const user = await User.create({
      username,
      email,
      password,
      fullName: fullName || '',
    });

    // 3. Generate JWT token
    const token = generateToken(user._id);

    // 4. Send response (without the password)
    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
        followers: user.followers,
        following: user.following,
        savedPosts: user.savedPosts || [],
      },
    });
  } catch (error) {
    // Handle Mongoose validation errors nicely
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0], // Return the first validation error
      });
    }

    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error — please try again',
    });
  }
};

// ==========================================
// @route   POST /api/auth/login
// @desc    Login an existing user
// @access  Public
// ==========================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // 2. Find the user and include the password field (it's excluded by default)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 3. Compare the entered password with the hashed password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 4. Generate token and send response
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        savedPosts: user.savedPosts || [],
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error — please try again',
    });
  }
};

// ==========================================
// @route   GET /api/auth/me
// @desc    Get the currently logged-in user's profile
// @access  Private (requires token)
// ==========================================
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = { register, login, getMe };
