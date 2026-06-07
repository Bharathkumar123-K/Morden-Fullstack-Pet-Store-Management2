const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort('-createdAt').limit(20);
  const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
  res.json({ success: true, notifications, unreadCount });
});

const markAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id }, { isRead: true });
  res.json({ success: true, message: 'All marked as read' });
});

const deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = { getNotifications, markAsRead, deleteNotification };
