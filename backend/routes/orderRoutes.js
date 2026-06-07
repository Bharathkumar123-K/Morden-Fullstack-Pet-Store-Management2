const router = require('express').Router();
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, authorize('admin', 'staff'), getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, authorize('admin', 'staff'), updateOrderStatus);

module.exports = router;
