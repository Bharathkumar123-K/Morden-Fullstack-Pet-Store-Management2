const router = require('express').Router();
const { getDashboardStats, getCategoryStats } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('admin', 'staff'), getDashboardStats);
router.get('/category-stats', protect, authorize('admin', 'staff'), getCategoryStats);

module.exports = router;
