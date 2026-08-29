import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { param } from 'express-validator';
import { getAllUsers, getUserById, deleteUser } from '../controllers/adminController.js';

const router = Router();

router.use(protect, authorize('admin'));

router.get('/', getAllUsers);
router.get('/:id', param('id').isMongoId().withMessage('Invalid user ID'), validate, getUserById);
router.delete('/:id', param('id').isMongoId().withMessage('Invalid user ID'), validate, deleteUser);

export default router;
