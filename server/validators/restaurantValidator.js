import { body, param } from 'express-validator';

export const createRestaurantValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').optional().trim(),
  body('cuisine').optional().isArray(),
  body('deliveryTime').optional().trim(),
  body('minOrder').optional().isFloat({ min: 0 }),
  body('isFeatured').optional().isBoolean(),
  body('isActive').optional().isBoolean(),
];

export const updateRestaurantValidator = [
  param('id').isMongoId().withMessage('Invalid restaurant ID'),
  body('name').optional().trim().notEmpty(),
  body('description').optional().trim(),
  body('cuisine').optional().isArray(),
  body('deliveryTime').optional().trim(),
  body('minOrder').optional().isFloat({ min: 0 }),
  body('isFeatured').optional().isBoolean(),
  body('isActive').optional().isBoolean(),
];

export const restaurantIdValidator = [param('id').isMongoId().withMessage('Invalid restaurant ID')];
