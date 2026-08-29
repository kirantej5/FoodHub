import User from '../models/User.js';
import { sendSuccess, sendError, getPagination, paginateResponse } from '../utils/apiResponse.js';
import { getDashboardStats } from '../services/orderService.js';
import Order from '../models/Order.js';
import Food from '../models/Food.js';
import Restaurant from '../models/Restaurant.js';

export const getDashboard = async (req, res) => {
  const stats = await getDashboardStats(Order, User, Food, Restaurant);
  sendSuccess(res, 200, 'Dashboard stats fetched', stats);
};

export const getAllUsers = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, 20);

  const [users, total] = await Promise.all([
    User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments({ role: 'user' }),
  ]);

  sendSuccess(res, 200, 'Users fetched', {
    users,
    pagination: paginateResponse(total, page, limit),
  });
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return sendError(res, 404, 'User not found');
  sendSuccess(res, 200, 'User fetched', { user });
};

export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return sendError(res, 404, 'User not found');
  sendSuccess(res, 200, 'User deleted');
};
