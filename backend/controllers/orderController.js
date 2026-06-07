const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Pet = require('../models/Pet');
const Product = require('../models/Product');
const Notification = require('../models/Notification');

// @POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, notes } = req.body;
  if (!items || items.length === 0) { res.status(400); throw new Error('No order items'); }

  let itemsPrice = 0;
  const orderItems = [];

  for (const item of items) {
    if (item.itemType === 'pet') {
      const pet = await Pet.findById(item.petId);
      if (!pet || pet.status !== 'available') { res.status(400); throw new Error(`Pet ${pet?.name || item.petId} not available`); }
      orderItems.push({ itemType: 'pet', pet: pet._id, name: pet.name, image: pet.images[0], price: pet.price, quantity: 1 });
      itemsPrice += pet.price;
    } else {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) { res.status(400); throw new Error(`Insufficient stock for ${product?.name}`); }
      orderItems.push({ itemType: 'product', product: product._id, name: product.name, image: product.images[0], price: product.salePrice || product.price, quantity: item.quantity });
      itemsPrice += (product.salePrice || product.price) * item.quantity;
    }
  }

  const taxPrice = itemsPrice * 0.08;
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const order = await Order.create({ customer: req.user._id, items: orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice, notes });

  // Update stock/status
  for (const item of orderItems) {
    if (item.itemType === 'pet') await Pet.findByIdAndUpdate(item.pet, { status: 'reserved' });
    else await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
  }

  await Notification.create({ user: req.user._id, title: 'Order Placed', message: `Your order #${order._id} has been placed successfully.`, type: 'order', link: `/orders/${order._id}` });

  res.status(201).json({ success: true, order });
});

// @GET /api/orders/myorders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user._id }).sort('-createdAt').populate('items.pet', 'name images').populate('items.product', 'name images');
  res.json({ success: true, orders });
});

// @GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('customer', 'name email phone').populate('items.pet').populate('items.product');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (req.user.role === 'customer' && order.customer._id.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized');
  }
  res.json({ success: true, order });
});

// @GET /api/orders - Staff/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10, search } = req.query;
  const query = {};
  if (status) query.status = status;
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query).populate('customer', 'name email').limit(limit * 1).skip((page - 1) * limit).sort('-createdAt');
  res.json({ success: true, orders, total, pages: Math.ceil(total / limit) });
});

// @PUT /api/orders/:id/status - Staff/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  order.status = req.body.status;
  order.processedBy = req.user._id;
  if (req.body.status === 'delivered') {
    order.deliveredAt = Date.now();
    order.paymentStatus = 'paid';
    for (const item of order.items) {
      if (item.itemType === 'pet') await Pet.findByIdAndUpdate(item.pet, { status: 'sold' });
    }
  }
  await order.save();
  await Notification.create({ user: order.customer, title: 'Order Updated', message: `Your order status is now: ${req.body.status}`, type: 'order', link: `/orders/${order._id}` });
  res.json({ success: true, order });
});

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
