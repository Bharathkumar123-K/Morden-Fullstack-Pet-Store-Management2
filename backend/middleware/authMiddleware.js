const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization?.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : null;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select('-password');
  if (!req.user || !req.user.isActive) {
    res.status(401);
    throw new Error('Not authorized');
  }
  next();
});

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403);
    throw new Error(`Role '${req.user.role}' is not authorized`);
  }
  next();
};

module.exports = { protect, authorize };
