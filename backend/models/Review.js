const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemType: { type: String, enum: ['pet', 'product', 'service'], required: true },
  pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
