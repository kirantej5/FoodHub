import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Food from '../models/Food.js';
import { sendSuccess, sendError, getPagination, paginateResponse } from '../utils/apiResponse.js';
import { validateCoupon } from '../services/orderService.js';

export const createOrder = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.food');
  if (!cart || cart.items.length === 0) return sendError(res, 400, 'Cart is empty');

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let discount = 0;
  let couponCode = '';

  if (req.body.couponCode) {
    const result = await validateCoupon(req.body.couponCode, subtotal);
    discount = result.discount;
    couponCode = result.coupon.code;
    result.coupon.usedCount += 1;
    await result.coupon.save();
  }

  const orderItems = cart.items.map((item) => ({
    food: item.food._id,
    name: item.food.name,
    quantity: item.quantity,
    price: item.price,
    image: item.food.image,
  }));

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    restaurant: cart.restaurant,
    totalAmount: subtotal - discount,
    discount,
    couponCode,
    deliveryAddress: req.body.deliveryAddress,
    paymentMethod: req.body.paymentMethod || 'cod',
    notes: req.body.notes || '',
  });

  cart.items = [];
  cart.restaurant = null;
  await cart.save();

  sendSuccess(res, 201, 'Order placed successfully', { order });
};

export const getMyOrders = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { user: req.user._id };

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('restaurant', 'name image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  sendSuccess(res, 200, 'Orders fetched', {
    orders,
    pagination: paginateResponse(total, page, limit),
  });
};

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('restaurant', 'name image deliveryTime')
    .populate('user', 'name email phone');

  if (!order) return sendError(res, 404, 'Order not found');
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return sendError(res, 403, 'Not authorized');
  }

  sendSuccess(res, 200, 'Order fetched', { order });
};

export const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return sendError(res, 404, 'Order not found');

  order.status = req.body.status;
  await order.save();
  sendSuccess(res, 200, 'Order status updated', { order });
};

export const getAllOrders = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, 20);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  sendSuccess(res, 200, 'Orders fetched', {
    orders,
    pagination: paginateResponse(total, page, limit),
  });
};

export const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return sendError(res, 404, 'Order not found');
  if (order.user.toString() !== req.user._id.toString()) return sendError(res, 403, 'Not authorized');
  if (!['pending', 'confirmed'].includes(order.status)) {
    return sendError(res, 400, 'Order cannot be cancelled at this stage');
  }

  order.status = 'cancelled';
  await order.save();
  sendSuccess(res, 200, 'Order cancelled', { order });
};
