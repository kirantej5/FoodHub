import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getDashboard } from '../controllers/adminController.js';

const router = Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboard);

export default router;
