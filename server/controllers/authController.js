import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { generateMockToken } from '../services/orderService.js';
import { uploadImage } from '../services/imageService.js';

export const register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return sendError(res, 400, 'Email already registered');

  const user = await User.create({ name, email, password, phone });
  const token = generateToken(user._id);

  sendSuccess(res, 201, 'Registration successful', {
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return sendError(res, 401, 'Invalid email or password');
  }

  const token = generateToken(user._id);

  sendSuccess(res, 200, 'Login successful', {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
    token,
  });
};

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist favorites');
  sendSuccess(res, 200, 'Profile fetched', { user });
};

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return sendError(res, 404, 'User not found');

  const { name, phone } = req.body;
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;

  if (req.file) {
    user.avatar = await uploadImage(req.file);
  }

  await user.save();
  sendSuccess(res, 200, 'Profile updated', { user });
};

export const addAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = req.body;

  if (address.isDefault) {
    user.addresses.forEach((a) => { a.isDefault = false; });
  }

  user.addresses.push(address);
  await user.save();
  sendSuccess(res, 201, 'Address added', { addresses: user.addresses });
};

export const updateAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) return sendError(res, 404, 'Address not found');

  Object.assign(address, req.body);
  if (req.body.isDefault) {
    user.addresses.forEach((a) => { a.isDefault = false; });
    address.isDefault = true;
  }

  await user.save();
  sendSuccess(res, 200, 'Address updated', { addresses: user.addresses });
};

export const deleteAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses.pull(req.params.addressId);
  await user.save();
  sendSuccess(res, 200, 'Address deleted', { addresses: user.addresses });
};

export const mockForgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return sendError(res, 404, 'User not found');

  const token = generateMockToken();
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  sendSuccess(res, 200, 'Password reset link sent (mock)', {
    resetToken: token,
    message: 'In production, this would be sent via email',
  });
};

export const mockResetPassword = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.body.token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) return sendError(res, 400, 'Invalid or expired reset token');

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  sendSuccess(res, 200, 'Password reset successful');
};

export const mockVerifyEmail = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.isEmailVerified = true;
  await user.save();
  sendSuccess(res, 200, 'Email verified (mock)');
};

export const toggleWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);
  const foodId = req.params.foodId;
  const index = user.wishlist.indexOf(foodId);

  if (index > -1) user.wishlist.splice(index, 1);
  else user.wishlist.push(foodId);

  await user.save();
  sendSuccess(res, 200, index > -1 ? 'Removed from wishlist' : 'Added to wishlist', {
    wishlist: user.wishlist,
  });
};

export const toggleFavorite = async (req, res) => {
  const user = await User.findById(req.user._id);
  const foodId = req.params.foodId;
  const index = user.favorites.indexOf(foodId);

  if (index > -1) user.favorites.splice(index, 1);
  else user.favorites.push(foodId);

  await user.save();
  sendSuccess(res, 200, index > -1 ? 'Removed from favorites' : 'Added to favorites', {
    favorites: user.favorites,
  });
};
