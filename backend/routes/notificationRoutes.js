const router = require('express').Router();
const { getNotifications, markAsRead, deleteNotification } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getNotifications);
router.put('/read-all', protect, markAsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
