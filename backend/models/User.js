const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['customer', 'staff', 'admin'], default: 'customer' },
  phone: { type: String },
  address: {
    street: String, city: String, state: String, zip: String, country: String
  },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }],
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
