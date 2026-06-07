const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  itemType: { type: String, enum: ['pet', 'product'], required: true },
  pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  image: String,
  price: Number,
  quantity: { type: Number, default: 1 }
});

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    street: String, city: String, state: String, zip: String, country: String
  },
  paymentMethod: { type: String, enum: ['stripe', 'cod', 'paypal'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paymentResult: { transactionId: String, status: String, updateTime: String },
  itemsPrice: { type: Number, default: 0 },
  taxPrice: { type: Number, default: 0 },
  shippingPrice: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  notes: String,
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deliveredAt: Date,
  invoiceUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
