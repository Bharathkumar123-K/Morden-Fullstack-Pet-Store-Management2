const router = require('express').Router();
const { createReview, getReviews, approveReview, deleteReview } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getReviews);
router.post('/', protect, createReview);
router.put('/:id/approve', protect, authorize('admin'), approveReview);
router.delete('/:id', protect, authorize('admin'), deleteReview);

module.exports = router;
