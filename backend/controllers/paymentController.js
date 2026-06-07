const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Payment = require('../models/Payment');

// @POST /api/payments/create-intent
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  const intent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100),
    currency: 'inr',
    metadata: { orderId: order._id.toString() }
  });
  res.json({ success: true, clientSecret: intent.client_secret });
});

// @POST /api/payments/confirm
const confirmPayment = asyncHandler(async (req, res) => {
  const { orderId, transactionId } = req.body;
  const order = await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid', status: 'confirmed', 'paymentResult.transactionId': transactionId, 'paymentResult.updateTime': new Date().toISOString() }, { new: true });
  await Payment.create({ user: req.user._id, order: orderId, amount: order.totalPrice, method: 'stripe', status: 'completed', transactionId });
  res.json({ success: true, order });
});

module.exports = { createPaymentIntent, confirmPayment };
