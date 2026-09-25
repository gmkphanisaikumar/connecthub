const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('⚠️  MONGO_URI is not set in environment variables! Please configure MONGO_URI in your Render service environment settings.');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // We log the error without killing the process immediately
  }
};

module.exports = connectDB;
