const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAllRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getNotifications);                   // Get all notifications
router.put('/read', markAllRead);                    // Mark all as read
router.delete('/:id', deleteNotification);           // Delete one

module.exports = router;
