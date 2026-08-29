import Cart from '../models/Cart.js';
import Food from '../models/Food.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

const populateCart = (query) =>
  query.populate({
    path: 'items.food',
    select: 'name price image isAvailable restaurant',
    populate: { path: 'restaurant', select: 'name' },
  }).populate('restaurant', 'name minOrder');

export const getCart = async (req, res) => {
  let cart = await populateCart(Cart.findOne({ user: req.user._id }));
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }
  sendSuccess(res, 200, 'Cart fetched', { cart });
};

export const addToCart = async (req, res) => {
  const { foodId, quantity = 1 } = req.body;
  const food = await Food.findById(foodId);
  if (!food || !food.isAvailable) return sendError(res, 404, 'Food not available');

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  if (cart.restaurant && cart.restaurant.toString() !== food.restaurant.toString()) {
    return sendError(res, 400, 'Cart can only contain items from one restaurant. Clear cart first.');
  }

  cart.restaurant = food.restaurant;
  const existing = cart.items.find((item) => item.food.toString() === foodId);

  if (existing) {
    existing.quantity += quantity;
    existing.price = food.price;
  } else {
    cart.items.push({ food: foodId, quantity, price: food.price });
  }

  await cart.save();
  cart = await populateCart(Cart.findById(cart._id));
  sendSuccess(res, 200, 'Item added to cart', { cart });
};

export const updateCartItem = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return sendError(res, 404, 'Cart not found');

  const item = cart.items.find((i) => i.food.toString() === req.params.foodId);
  if (!item) return sendError(res, 404, 'Item not in cart');

  item.quantity = req.body.quantity;
  await cart.save();

  const populated = await populateCart(Cart.findById(cart._id));
  sendSuccess(res, 200, 'Cart updated', { cart: populated });
};

export const removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return sendError(res, 404, 'Cart not found');

  cart.items = cart.items.filter((i) => i.food.toString() !== req.params.foodId);
  if (cart.items.length === 0) cart.restaurant = null;

  await cart.save();
  const populated = await populateCart(Cart.findById(cart._id));
  sendSuccess(res, 200, 'Item removed', { cart: populated });
};

export const clearCart = async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], restaurant: null });
  sendSuccess(res, 200, 'Cart cleared');
};
