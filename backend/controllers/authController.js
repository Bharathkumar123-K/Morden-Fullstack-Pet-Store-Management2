const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured');
  if (!process.env.JWT_EXPIRE) throw new Error('JWT_EXPIRE is not configured');
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// @POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  if (await User.findOne({ email })) {
    res.status(400);
    throw new Error('Email already registered');
  }

  try {
    const user = await User.create({ name, email, password, phone });
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    // Provide clearer errors for common prod issues (e.g., schema validation, duplicate key)
    if (err && err.code === 11000) {
      res.status(400);
      throw new Error('Email already registered');
    }
    res.status(400);
    throw new Error(err.message || 'Registration failed');
  }
});

// @POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401); throw new Error('Invalid email or password');
  }
  if (!user.isActive) { res.status(401); throw new Error('Account deactivated'); }
  res.json({ success: true, token: generateToken(user._id), user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
});

// @POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) { res.status(404); throw new Error('No user with that email'); }
  const token = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save();
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await sendEmail({ to: user.email, subject: 'Password Reset', text: `Reset your password: ${resetUrl}` });
  res.json({ success: true, message: 'Reset email sent' });
});

// @PUT /api/auth/reset-password/:token
const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
  if (!user) { res.status(400); throw new Error('Invalid or expired token'); }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  res.json({ success: true, token: generateToken(user._id) });
});

// @GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = { register, login, forgotPassword, resetPassword, getMe };
