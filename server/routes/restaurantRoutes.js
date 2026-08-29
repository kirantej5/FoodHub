import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';
import {
  createRestaurantValidator,
  updateRestaurantValidator,
  restaurantIdValidator,
} from '../validators/restaurantValidator.js';
import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getFeaturedRestaurants,
} from '../controllers/restaurantController.js';

const router = Router();

router.get('/featured', getFeaturedRestaurants);
router.get('/', getRestaurants);
router.get('/:id', restaurantIdValidator, validate, getRestaurantById);

router.post('/', protect, authorize('admin'), upload.single('image'), createRestaurantValidator, validate, createRestaurant);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateRestaurantValidator, validate, updateRestaurant);
router.delete('/:id', protect, authorize('admin'), restaurantIdValidator, validate, deleteRestaurant);

export default router;
