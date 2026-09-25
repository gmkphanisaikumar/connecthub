const Notification = require('../models/Notification');

// ==========================================
// @route   GET /api/notifications
// @desc    Get all notifications for the logged-in user
// @access  Private
// ==========================================
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'username fullName profilePicture')
      .populate('post', 'text image')
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Get Notifications Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==========================================
// @route   PUT /api/notifications/read
// @desc    Mark all notifications as read
// @access  Private
// ==========================================
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('Mark Read Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==========================================
// @route   DELETE /api/notifications/:id
// @desc    Delete a single notification
// @access  Private
// ==========================================
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error) {
    console.error('Delete Notification Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getNotifications, markAllRead, deleteNotification };
