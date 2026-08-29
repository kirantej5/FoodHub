import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';
import {
  createFoodValidator,
  updateFoodValidator,
  foodIdValidator,
  foodQueryValidator,
  reviewValidator,
} from '../validators/foodValidator.js';
import {
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  addReview,
  searchSuggestions,
  getRecommended,
  getPopular,
} from '../controllers/foodController.js';

const router = Router();

router.get('/suggestions', searchSuggestions);
router.get('/popular', getPopular);
router.get('/recommended', protect, getRecommended);
router.get('/', foodQueryValidator, validate, getAllFoods);
router.get('/:id', foodIdValidator, validate, getFoodById);

router.post('/', protect, authorize('admin'), upload.single('image'), createFoodValidator, validate, createFood);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateFoodValidator, validate, updateFood);
router.delete('/:id', protect, authorize('admin'), foodIdValidator, validate, deleteFood);
router.post('/:id/reviews', protect, reviewValidator, validate, addReview);

export default router;
