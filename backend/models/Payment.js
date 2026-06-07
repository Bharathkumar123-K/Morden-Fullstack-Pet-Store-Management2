const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'usd' },
  method: { type: String, enum: ['stripe', 'paypal', 'cod'] },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  transactionId: String,
  stripePaymentIntentId: String
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
