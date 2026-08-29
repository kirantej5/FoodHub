import { body, param, query } from 'express-validator';

export const createFoodValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('restaurant').notEmpty().withMessage('Restaurant is required'),
  body('tags').optional().isArray(),
  body('isAvailable').optional().isBoolean(),
  body('isPopular').optional().isBoolean(),
  body('isFeatured').optional().isBoolean(),
];

export const updateFoodValidator = [
  param('id').isMongoId().withMessage('Invalid food ID'),
  body('name').optional().trim().notEmpty().isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('price').optional().isFloat({ min: 0 }),
  body('category').optional().notEmpty(),
  body('restaurant').optional().notEmpty(),
  body('tags').optional().isArray(),
  body('isAvailable').optional().isBoolean(),
  body('isPopular').optional().isBoolean(),
  body('isFeatured').optional().isBoolean(),
];

export const foodIdValidator = [param('id').isMongoId().withMessage('Invalid food ID')];

export const foodQueryValidator = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('sort').optional().isIn(['price_asc', 'price_desc', 'rating', 'newest', 'popular']),
];

export const reviewValidator = [
  param('id').isMongoId().withMessage('Invalid food ID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('comment').optional().trim().isLength({ max: 500 }),
];
