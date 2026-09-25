const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'connecthub_super_secret_key_2024';

// This middleware protects routes — only logged-in users can access them
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in the Authorization header: "Bearer <token>"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token found, the user is not logged in
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized — please log in',
      });
    }

    // Verify the token and extract the user's ID from it
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find the user in the database and attach to the request
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
      });
    }

    next(); // Continue to the next middleware/route handler
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized — invalid token',
    });
  }
};

module.exports = { protect };
