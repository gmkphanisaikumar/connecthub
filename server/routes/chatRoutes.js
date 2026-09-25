const express = require('express');
const router = express.Router();
const {
  getConversations,
  getMessages,
  sendMessage,
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/conversations', getConversations);     // List all chats
router.get('/messages/:userId', getMessages);        // Get chat with a user
router.post('/messages/:userId', sendMessage);       // Send a message

module.exports = router;
