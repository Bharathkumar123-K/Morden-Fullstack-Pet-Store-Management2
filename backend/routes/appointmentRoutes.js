const router = require('express').Router();
const { createAppointment, getMyAppointments, getAllAppointments, getAppointmentById, updateAppointment } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createAppointment);
router.get('/my', protect, getMyAppointments);
router.get('/', protect, authorize('admin', 'staff'), getAllAppointments);
router.get('/:id', protect, getAppointmentById);
router.put('/:id', protect, authorize('admin', 'staff'), updateAppointment);

module.exports = router;
