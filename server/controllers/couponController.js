import Coupon from '../models/Coupon.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { validateCoupon } from '../services/orderService.js';

export const getCoupons = async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
  sendSuccess(res, 200, 'Coupons fetched', { coupons });
};

export const createCoupon = async (req, res) => {
  const coupon = await Coupon.create(req.body);
  sendSuccess(res, 201, 'Coupon created', { coupon });
};

export const validateCouponCode = async (req, res) => {
  try {
    const amount = parseFloat(req.body.amount) || 0;
    const result = await validateCoupon(req.body.code, amount);
    sendSuccess(res, 200, 'Coupon valid', {
      code: result.coupon.code,
      discount: result.discount,
      discountType: result.coupon.discountType,
    });
  } catch (err) {
    sendError(res, err.statusCode || 400, err.message);
  }
};

export const deleteCoupon = async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) return sendError(res, 404, 'Coupon not found');
  sendSuccess(res, 200, 'Coupon deleted');
};
