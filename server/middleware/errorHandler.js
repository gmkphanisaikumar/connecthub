// Global error handler — catches any error passed via next(error)
// Express recognizes this as an error handler because it has 4 parameters
const errorHandler = (err, req, res, next) => {
  // Log the error (only show full stack in development)
  if (process.env.NODE_ENV === 'development') {
    console.error('🔴 Error:', err.stack || err.message);
  } else {
    console.error('🔴 Error:', err.message);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Multer errors (file size, format, limits)
  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Image size exceeds maximum 10MB limit. Please upload a smaller image.';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected file field in upload request.';
    } else {
      message = err.message || 'File upload error';
    }
  }

  // Handle specific Mongoose/MongoDB errors with friendly messages
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message)[0];
  }

  if (err.code === 11000) {
    // Duplicate key error (e.g., email or username already exists)
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  if (err.name === 'CastError') {
    // Invalid MongoDB ObjectId
    statusCode = 400;
    message = 'Invalid ID format';
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token — please log in again';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired — please log in again';
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;

