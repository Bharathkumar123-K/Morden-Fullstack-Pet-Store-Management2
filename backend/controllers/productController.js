const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const { category, petType, minPrice, maxPrice, search, page = 1, limit = 12, sort = '-createdAt' } = req.query;
  const query = { isActive: true };
  if (category) query.category = category;
  if (petType) query.petType = { $in: [petType] };
  if (minPrice || maxPrice) query.price = { ...(minPrice && { $gte: minPrice }), ...(maxPrice && { $lte: maxPrice }) };
  if (search) query.name = { $regex: search, $options: 'i' };
  const total = await Product.countDocuments(query);
  const products = await Product.find(query).limit(limit * 1).skip((page - 1) * limit).sort(sort);
  res.json({ success: true, products, total, pages: Math.ceil(total / limit) });
});

// @GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, product });
});

// @POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({ ...req.body, addedBy: req.user._id });
  res.status(201).json({ success: true, product });
});

// @PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, product });
});

// @DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Product removed' });
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
