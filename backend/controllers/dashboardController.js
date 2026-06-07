const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Pet = require('../models/Pet');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Appointment = require('../models/Appointment');

const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalPets, totalProducts, totalOrders, totalAppointments] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    Pet.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Appointment.countDocuments()
  ]);

  const revenueData = await Order.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: { $month: '$createdAt' }, revenue: { $sum: '$totalPrice' }, orders: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  const recentOrders = await Order.find().populate('customer', 'name email').sort('-createdAt').limit(5);
  const recentAppointments = await Appointment.find().populate('customer', 'name').populate('service', 'name type').sort('-createdAt').limit(5);

  const totalRevenue = await Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]);

  const lowStockProducts = await Product.find({ stock: { $lt: 10 }, isActive: true }).limit(5);
  const pendingOrders = await Order.countDocuments({ status: 'pending' });
  const todayAppointments = await Appointment.countDocuments({ date: { $gte: new Date().setHours(0, 0, 0, 0), $lt: new Date().setHours(23, 59, 59, 999) } });

  res.json({
    success: true,
    stats: { totalUsers, totalPets, totalProducts, totalOrders, totalAppointments, totalRevenue: totalRevenue[0]?.total || 0, pendingOrders, todayAppointments },
    revenueData,
    recentOrders,
    recentAppointments,
    lowStockProducts
  });
});

const getCategoryStats = asyncHandler(async (req, res) => {
  const petsByCategory = await Pet.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
  const ordersByStatus = await Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  res.json({ success: true, petsByCategory, ordersByStatus });
});

module.exports = { getDashboardStats, getCategoryStats };
