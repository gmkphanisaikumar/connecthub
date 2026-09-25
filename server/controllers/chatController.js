const Message = require('../models/Message');
const User = require('../models/User');

// Helper: Create a conversation ID from two user IDs
// Sorts them so the ID is the same regardless of who initiates
const getConversationId = (userId1, userId2) => {
  return [userId1, userId2].sort().join('_');
};

// ==========================================
// @route   GET /api/chat/conversations
// @desc    Get all conversations for the logged-in user
// @access  Private
// ==========================================
const getConversations = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    // Find all messages where this user is sender or receiver
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'username fullName profilePicture')
      .populate('receiver', 'username fullName profilePicture');

    // Group by conversation and get the latest message for each
    const conversationsMap = {};

    for (const msg of messages) {
      if (!conversationsMap[msg.conversationId]) {
        // Determine who the "other" user is
        const otherUser =
          msg.sender._id.toString() === userId ? msg.receiver : msg.sender;

        // Count unread messages in this conversation
        const unreadCount = await Message.countDocuments({
          conversationId: msg.conversationId,
          receiver: req.user._id,
          read: false,
        });

        conversationsMap[msg.conversationId] = {
          conversationId: msg.conversationId,
          user: otherUser,
          lastMessage: msg.text,
          lastMessageTime: msg.createdAt,
          unreadCount,
        };
      }
    }

    const conversations = Object.values(conversationsMap);

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error('Get Conversations Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==========================================
// @route   GET /api/chat/messages/:userId
// @desc    Get messages between current user and another user
// @access  Private
// ==========================================
const getMessages = async (req, res) => {
  try {
    const conversationId = getConversationId(
      req.user._id.toString(),
      req.params.userId
    );

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 }) // Oldest first (chat order)
      .populate('sender', 'username fullName profilePicture')
      .populate('receiver', 'username fullName profilePicture');

    // Mark all messages from the other user as read
    await Message.updateMany(
      {
        conversationId,
        receiver: req.user._id,
        read: false,
      },
      { read: true }
    );

    res.status(200).json({
      success: true,
      messages,
      conversationId,
    });
  } catch (error) {
    console.error('Get Messages Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==========================================
// @route   POST /api/chat/messages/:userId
// @desc    Send a message to another user
// @access  Private
// ==========================================
const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty',
      });
    }

    const receiverExists = await User.findById(req.params.userId);
    if (!receiverExists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const conversationId = getConversationId(
      req.user._id.toString(),
      req.params.userId
    );

    const message = await Message.create({
      conversationId,
      sender: req.user._id,
      receiver: req.params.userId,
      text: text.trim(),
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username fullName profilePicture')
      .populate('receiver', 'username fullName profilePicture');

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    console.error('Send Message Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getConversations, getMessages, sendMessage, getConversationId };
