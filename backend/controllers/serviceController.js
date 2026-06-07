const asyncHandler = require('express-async-handler');
const Service = require('../models/Service');

const getServices = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const query = { isActive: true };
  if (type) query.type = type;
  const services = await Service.find(query).sort('type name');
  res.json({ success: true, services });
});

const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) { res.status(404); throw new Error('Service not found'); }
  res.json({ success: true, service });
});

const createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json({ success: true, service });
});

const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!service) { res.status(404); throw new Error('Service not found'); }
  res.json({ success: true, service });
});

const deleteService = asyncHandler(async (req, res) => {
  await Service.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Service removed' });
});

module.exports = { getServices, getServiceById, createService, updateService, deleteService };
