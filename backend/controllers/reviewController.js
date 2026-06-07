const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Pet = require('../models/Pet');
const Product = require('../models/Product');

const createReview = asyncHandler(async (req, res) => {
  const { itemType, itemId, rating, comment } = req.body;
  const review = await Review.create({ user: req.user._id, itemType, [`${itemType}`]: itemId, rating, comment });

  // Update average rating
  const reviews = await Review.find({ itemType, [`${itemType}`]: itemId, isApproved: true });
  const avg = reviews.reduce((a, b) => a + b.rating, 0) / reviews.length;
  const Model = itemType === 'pet' ? Pet : Product;
  await Model.findByIdAndUpdate(itemId, { rating: avg.toFixed(1), numReviews: reviews.length });

  res.status(201).json({ success: true, review });
});

const getReviews = asyncHandler(async (req, res) => {
  const { itemType, itemId } = req.query;
  const query = { isApproved: true };
  if (itemType) query.itemType = itemType;
  if (itemId) query[itemType] = itemId;
  const reviews = await Review.find(query).populate('user', 'name avatar').sort('-createdAt');
  res.json({ success: true, reviews });
});

const approveReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
  res.json({ success: true, review });
});

const deleteReview = asyncHandler(async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Review deleted' });
});

module.exports = { createReview, getReviews, approveReview, deleteReview };
