const router = require('express').Router();
const { getPets, getPetById, createPet, updatePet, deletePet, getFeaturedPets } = require('../controllers/petController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/featured', getFeaturedPets);
router.get('/', getPets);
router.get('/:id', getPetById);
router.post('/', protect, authorize('admin', 'staff'), createPet);
router.put('/:id', protect, authorize('admin', 'staff'), updatePet);
router.delete('/:id', protect, authorize('admin'), deletePet);

module.exports = router;
