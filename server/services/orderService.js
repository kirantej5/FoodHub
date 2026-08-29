import crypto from 'crypto';
import Coupon from '../models/Coupon.js';

export const validateCoupon = async (code, orderAmount) => {
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
    expiresAt: { $gt: new Date() },
  });

  if (!coupon) {
    throw Object.assign(new Error('Invalid or expired coupon'), { statusCode: 400 });
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw Object.assign(new Error('Coupon usage limit reached'), { statusCode: 400 });
  }

  if (orderAmount < coupon.minOrderAmount) {
    throw Object.assign(
      new Error(`Minimum order amount is ₹${coupon.minOrderAmount}`),
      { statusCode: 400 }
    );
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (orderAmount * coupon.discountValue) / 100;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  } else {
    discount = coupon.discountValue;
  }

  return { coupon, discount: Math.min(discount, orderAmount) };
};

export const generateMockToken = () => crypto.randomBytes(32).toString('hex');

export const getDashboardStats = async (Order, User, Food, Restaurant) => {
  const [
    totalOrders,
    totalUsers,
    totalFoods,
    totalRestaurants,
    revenueResult,
    ordersByStatus,
    recentOrders,
    monthlyRevenue,
  ] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: 'user' }),
    Food.countDocuments(),
    Restaurant.countDocuments(),
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Order.find()
      .populate('user', 'name email')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Order.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
          createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  return {
    totals: {
      orders: totalOrders,
      users: totalUsers,
      foods: totalFoods,
      restaurants: totalRestaurants,
      revenue: revenueResult[0]?.total || 0,
    },
    ordersByStatus: ordersByStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    recentOrders,
    monthlyRevenue,
  };
};
