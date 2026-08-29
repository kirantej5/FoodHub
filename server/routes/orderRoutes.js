import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createOrderValidator, orderIdValidator, updateOrderStatusValidator } from '../validators/orderValidator.js';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  cancelOrder,
} from '../controllers/orderController.js';

const router = Router();

router.use(protect);

// User routes
router.post('/', createOrderValidator, validate, createOrder);
router.get('/my', getMyOrders);
router.get('/:id', orderIdValidator, validate, getOrderById);
router.put('/:id/cancel', orderIdValidator, validate, cancelOrder);

// Admin routes
router.get('/', authorize('admin'), getAllOrders);
router.put('/:id/status', authorize('admin'), updateOrderStatusValidator, validate, updateOrderStatus);

export default router;
