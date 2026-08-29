import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';
import {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
} from '../validators/categoryValidator.js';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';

const router = Router();

router.get('/', getCategories);
router.get('/:id', categoryIdValidator, validate, getCategoryById);

router.post('/', protect, authorize('admin'), upload.single('image'), createCategoryValidator, validate, createCategory);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateCategoryValidator, validate, updateCategory);
router.delete('/:id', protect, authorize('admin'), categoryIdValidator, validate, deleteCategory);

export default router;
