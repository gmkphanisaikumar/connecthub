const multer = require('multer');
const path = require('path');

// Configure WHERE and HOW files are stored
const storage = multer.diskStorage({
  // WHERE: Save files to the "uploads" folder
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  // HOW: Name files uniquely using timestamp + random number
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Filter: Only allow image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
  }
};

// Create the multer instance with limits
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max file size
  },
});

module.exports = upload;
