const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');

// @POST /api/appointments
const createAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.create({ ...req.body, customer: req.user._id });
  await Notification.create({ user: req.user._id, title: 'Appointment Booked', message: `Your appointment is scheduled for ${new Date(appointment.date).toDateString()} at ${appointment.timeSlot}`, type: 'appointment', link: `/appointments/${appointment._id}` });
  res.status(201).json({ success: true, appointment });
});

// @GET /api/appointments/my
const getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ customer: req.user._id }).populate('service', 'name type price').sort('-date');
  res.json({ success: true, appointments });
});

// @GET /api/appointments - Staff/Admin
const getAllAppointments = asyncHandler(async (req, res) => {
  const { status, date, type, page = 1, limit = 10 } = req.query;
  const query = {};
  if (status) query.status = status;
  if (date) { const d = new Date(date); query.date = { $gte: d, $lt: new Date(d.setDate(d.getDate() + 1)) }; }
  const total = await Appointment.countDocuments(query);
  const appointments = await Appointment.find(query)
    .populate('customer', 'name email phone')
    .populate('service', 'name type price duration')
    .populate('assignedStaff', 'name')
    .limit(limit * 1).skip((page - 1) * limit).sort('-date');
  res.json({ success: true, appointments, total, pages: Math.ceil(total / limit) });
});

// @GET /api/appointments/:id
const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate('customer', 'name email phone').populate('service').populate('assignedStaff', 'name');
  if (!appointment) { res.status(404); throw new Error('Appointment not found'); }
  res.json({ success: true, appointment });
});

// @PUT /api/appointments/:id
const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!appointment) { res.status(404); throw new Error('Appointment not found'); }
  if (req.body.status) {
    await Notification.create({ user: appointment.customer, title: 'Appointment Updated', message: `Your appointment status: ${req.body.status}`, type: 'appointment' });
  }
  res.json({ success: true, appointment });
});

module.exports = { createAppointment, getMyAppointments, getAllAppointments, getAppointmentById, updateAppointment };
