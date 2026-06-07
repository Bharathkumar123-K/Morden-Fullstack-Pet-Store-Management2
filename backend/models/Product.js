const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['food', 'toys', 'accessories', 'medicine', 'grooming', 'other'] },
  petType: [String],
  brand: String,
  price: { type: Number, required: true },
  salePrice: Number,
  stock: { type: Number, required: true, default: 0 },
  description: { type: String, required: true },
  images: [String],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  weight: String,
  dimensions: String,
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
