const asyncHandler = require('express-async-handler');
const Pet = require('../models/Pet');

// @GET /api/pets
const getPets = asyncHandler(async (req, res) => {
  const { category, status, gender, minPrice, maxPrice, search, page = 1, limit = 12, sort = '-createdAt', isAdoption } = req.query;
  const query = {};
  if (category) query.category = category;
  if (status) query.status = status;
  else query.status = { $ne: 'sold' };
  if (gender) query.gender = gender;
  if (isAdoption) query.isAdoption = isAdoption === 'true';
  if (minPrice || maxPrice) query.price = { ...(minPrice && { $gte: minPrice }), ...(maxPrice && { $lte: maxPrice }) };
  if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { breed: { $regex: search, $options: 'i' } }];
  const total = await Pet.countDocuments(query);
  const pets = await Pet.find(query).populate('category', 'name').limit(limit * 1).skip((page - 1) * limit).sort(sort);
  res.json({ success: true, pets, total, pages: Math.ceil(total / limit) });
});

// @GET /api/pets/:id
const getPetById = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id).populate('category', 'name').populate('addedBy', 'name');
  if (!pet) { res.status(404); throw new Error('Pet not found'); }
  res.json({ success: true, pet });
});

// @POST /api/pets
const createPet = asyncHandler(async (req, res) => {
  const pet = await Pet.create({ ...req.body, addedBy: req.user._id });
  res.status(201).json({ success: true, pet });
});

// @PUT /api/pets/:id
const updatePet = asyncHandler(async (req, res) => {
  const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!pet) { res.status(404); throw new Error('Pet not found'); }
  res.json({ success: true, pet });
});

// @DELETE /api/pets/:id
const deletePet = asyncHandler(async (req, res) => {
  const pet = await Pet.findByIdAndDelete(req.params.id);
  if (!pet) { res.status(404); throw new Error('Pet not found'); }
  res.json({ success: true, message: 'Pet deleted' });
});

// @GET /api/pets/featured
const getFeaturedPets = asyncHandler(async (req, res) => {
  const pets = await Pet.find({ status: 'available' }).populate('category', 'name').sort('-rating').limit(8);
  res.json({ success: true, pets });
});

module.exports = { getPets, getPetById, createPet, updatePet, deletePet, getFeaturedPets };
