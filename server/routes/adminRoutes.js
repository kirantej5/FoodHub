import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getDashboard, getAllUsers, getUserById, deleteUser } from '../controllers/adminController.js';

const router = Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);

export default router;
