import Restaurant from '../models/Restaurant.js';
import { sendSuccess, sendError, getPagination, paginateResponse } from '../utils/apiResponse.js';
import { uploadImage } from '../services/imageService.js';

export const getRestaurants = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = req.user?.role === 'admin' ? {} : { isActive: true };

  if (req.query.featured === 'true') filter.isFeatured = true;
  if (req.query.cuisine) filter.cuisine = req.query.cuisine;
  if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' };

  const [restaurants, total] = await Promise.all([
    Restaurant.find(filter).sort({ isFeatured: -1, rating: -1 }).skip(skip).limit(limit).lean(),
    Restaurant.countDocuments(filter),
  ]);

  sendSuccess(res, 200, 'Restaurants fetched', {
    restaurants,
    pagination: paginateResponse(total, page, limit),
  });
};

export const getRestaurantById = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) return sendError(res, 404, 'Restaurant not found');
  sendSuccess(res, 200, 'Restaurant fetched', { restaurant });
};

export const createRestaurant = async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.image = await uploadImage(req.file);
  const restaurant = await Restaurant.create(data);
  sendSuccess(res, 201, 'Restaurant created', { restaurant });
};

export const updateRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) return sendError(res, 404, 'Restaurant not found');

  Object.assign(restaurant, req.body);
  if (req.file) restaurant.image = await uploadImage(req.file);
  await restaurant.save();
  sendSuccess(res, 200, 'Restaurant updated', { restaurant });
};

export const deleteRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
  if (!restaurant) return sendError(res, 404, 'Restaurant not found');
  sendSuccess(res, 200, 'Restaurant deleted');
};

export const getFeaturedRestaurants = async (req, res) => {
  const restaurants = await Restaurant.find({ isActive: true, isFeatured: true })
    .sort({ rating: -1 })
    .limit(6)
    .lean();
  sendSuccess(res, 200, 'Featured restaurants fetched', { restaurants });
};
