const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'PetCategory', required: true },
  breed: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  color: String,
  weight: String,
  price: { type: Number, required: true },
  description: { type: String, required: true },
  images: [String],
  status: { type: String, enum: ['available', 'sold', 'reserved', 'adoption'], default: 'available' },
  isVaccinated: { type: Boolean, default: false },
  isMicrochipped: { type: Boolean, default: false },
  isNeutered: { type: Boolean, default: false },
  healthCertificate: { type: Boolean, default: false },
  features: [String],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isAdoption: { type: Boolean, default: false },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Pet', petSchema);
