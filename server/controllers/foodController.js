import Food from '../models/Food.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import {
  getFoods,
  getSearchSuggestions,
  getRecommendedFoods,
  getPopularFoods,
} from '../services/foodService.js';
import { uploadImage } from '../services/imageService.js';

export const getAllFoods = async (req, res) => {
  const result = await getFoods(req.query);
  sendSuccess(res, 200, 'Foods fetched', result);
};

export const getFoodById = async (req, res) => {
  const food = await Food.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('restaurant', 'name deliveryTime rating address cuisine')
    .populate('reviews.user', 'name avatar');

  if (!food) return sendError(res, 404, 'Food not found');
  sendSuccess(res, 200, 'Food fetched', { food });
};

export const createFood = async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.image = await uploadImage(req.file);

  const food = await Food.create(data);
  sendSuccess(res, 201, 'Food created', { food });
};

export const updateFood = async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) return sendError(res, 404, 'Food not found');

  Object.assign(food, req.body);
  if (req.file) food.image = await uploadImage(req.file);

  await food.save();
  sendSuccess(res, 200, 'Food updated', { food });
};

export const deleteFood = async (req, res) => {
  const food = await Food.findByIdAndDelete(req.params.id);
  if (!food) return sendError(res, 404, 'Food not found');
  sendSuccess(res, 200, 'Food deleted');
};

export const addReview = async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) return sendError(res, 404, 'Food not found');

  const existing = food.reviews.find((r) => r.user.toString() === req.user._id.toString());
  if (existing) return sendError(res, 400, 'You already reviewed this food');

  food.reviews.push({ user: req.user._id, rating: req.body.rating, comment: req.body.comment });

  const totalRating = food.reviews.reduce((sum, r) => sum + r.rating, 0);
  food.rating = totalRating / food.reviews.length;
  food.reviewCount = food.reviews.length;

  await food.save();
  sendSuccess(res, 201, 'Review added', { food });
};

export const searchSuggestions = async (req, res) => {
  const suggestions = await getSearchSuggestions(req.query.q);
  sendSuccess(res, 200, 'Suggestions fetched', { suggestions });
};

export const getRecommended = async (req, res) => {
  const foods = await getRecommendedFoods(req.user?._id);
  sendSuccess(res, 200, 'Recommended foods fetched', { foods });
};

export const getPopular = async (req, res) => {
  const foods = await getPopularFoods(parseInt(req.query.limit, 10) || 8);
  sendSuccess(res, 200, 'Popular foods fetched', { foods });
};
