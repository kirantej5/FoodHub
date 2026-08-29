import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  addToCartValidator,
  updateCartItemValidator,
  cartItemIdValidator,
} from '../validators/cartValidator.js';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';

const router = Router();

router.use(protect);

router.get('/', getCart);
router.post('/add', addToCartValidator, validate, addToCart);
router.put('/:foodId', updateCartItemValidator, validate, updateCartItem);
router.delete('/:foodId', cartItemIdValidator, validate, removeFromCart);
router.delete('/', clearCart);

export default router;
