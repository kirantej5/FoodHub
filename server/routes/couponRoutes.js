import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { param } from 'express-validator';
import { getCoupons, createCoupon, validateCouponCode, deleteCoupon } from '../controllers/couponController.js';

const router = Router();

// Public: validate a coupon code
router.post('/validate', protect, validateCouponCode);

// Admin only
router.get('/', protect, authorize('admin'), getCoupons);
router.post('/', protect, authorize('admin'), createCoupon);
router.delete('/:id', protect, authorize('admin'), param('id').isMongoId().withMessage('Invalid coupon ID'), validate, deleteCoupon);

export default router;
