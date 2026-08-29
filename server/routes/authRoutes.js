import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';
import {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  addressValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from '../validators/authValidator.js';
import {
  register,
  login,
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  mockForgotPassword,
  mockResetPassword,
  mockVerifyEmail,
  toggleWishlist,
  toggleFavorite,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/forgot-password', forgotPasswordValidator, validate, mockForgotPassword);
router.post('/reset-password', resetPasswordValidator, validate, mockResetPassword);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfileValidator, validate, updateProfile);
router.post('/verify-email', protect, mockVerifyEmail);

router.post('/addresses', protect, addressValidator, validate, addAddress);
router.put('/addresses/:addressId', protect, addressValidator, validate, updateAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

router.post('/wishlist/:foodId', protect, toggleWishlist);
router.post('/favorites/:foodId', protect, toggleFavorite);

export default router;
