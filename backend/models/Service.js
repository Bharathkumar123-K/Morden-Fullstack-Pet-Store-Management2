const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['grooming', 'veterinary', 'training', 'boarding'], required: true },
  description: String,
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // minutes
  petTypes: [String],
  image: String,
  isActive: { type: Boolean, default: true },
  features: [String]
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
