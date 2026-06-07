const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet' },
  petName: String,
  petType: String,
  petAge: String,
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  notes: String,
  totalPrice: Number,
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reminderSent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
