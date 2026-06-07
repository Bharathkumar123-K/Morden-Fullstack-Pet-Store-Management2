const router = require('express').Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorize('admin', 'staff'), createProduct);
router.put('/:id', protect, authorize('admin', 'staff'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
