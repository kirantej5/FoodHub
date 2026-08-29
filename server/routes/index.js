import { Router } from 'express';
import authRoutes from './authRoutes.js';
import foodRoutes from './foodRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import restaurantRoutes from './restaurantRoutes.js';
import cartRoutes from './cartRoutes.js';
import orderRoutes from './orderRoutes.js';
import userRoutes from './userRoutes.js';
import couponRoutes from './couponRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/foods', foodRoutes);
router.use('/categories', categoryRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);
router.use('/coupons', couponRoutes);
router.use('/admin', adminRoutes);

export default router;
