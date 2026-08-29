import Food from '../models/Food.js';
import { getPagination, paginateResponse } from '../utils/apiResponse.js';

const SORT_MAP = {
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  rating: { rating: -1, reviewCount: -1 },
  newest: { createdAt: -1 },
  popular: { isPopular: -1, rating: -1 },
};

/**
 * Build optimized MongoDB filter from query params.
 */
export const buildFoodFilter = (query) => {
  const filter = { isAvailable: true };

  if (query.category) filter.category = query.category;
  if (query.restaurant) filter.restaurant = query.restaurant;
  if (query.isPopular === 'true') filter.isPopular = true;
  if (query.isFeatured === 'true') filter.isFeatured = true;

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = parseFloat(query.minPrice);
    if (query.maxPrice) filter.price.$lte = parseFloat(query.maxPrice);
  }

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  return filter;
};

export const getFoods = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = buildFoodFilter(query);
  const sort = SORT_MAP[query.sort] || (query.search ? { score: { $meta: 'textScore' } } : { createdAt: -1 });

  const projection = query.search ? { score: { $meta: 'textScore' } } : {};

  const [foods, total] = await Promise.all([
    Food.find(filter, projection)
      .populate('category', 'name slug')
      .populate('restaurant', 'name deliveryTime rating')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Food.countDocuments(filter),
  ]);

  return {
    foods,
    pagination: paginateResponse(total, page, limit),
  };
};

export const getSearchSuggestions = async (term, limit = 8) => {
  if (!term || term.length < 2) return [];

  const regex = new RegExp(term, 'i');

  return Food.find({
    isAvailable: true,
    $or: [{ name: regex }, { tags: regex }],
  })
    .select('name image price tags')
    .limit(limit)
    .lean();
};

export const getRecommendedFoods = async (userId, limit = 8) => {
  const filter = { isAvailable: true, isFeatured: true };
  return Food.find(filter)
    .populate('category', 'name')
    .populate('restaurant', 'name')
    .sort({ rating: -1 })
    .limit(limit)
    .lean();
};

export const getPopularFoods = async (limit = 8) => {
  return Food.find({ isAvailable: true, isPopular: true })
    .populate('category', 'name')
    .populate('restaurant', 'name deliveryTime')
    .sort({ rating: -1, reviewCount: -1 })
    .limit(limit)
    .lean();
};
