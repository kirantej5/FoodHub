import { body, param } from 'express-validator';

export const addToCartValidator = [
  body('foodId').notEmpty().withMessage('Food ID is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

export const updateCartItemValidator = [
  param('foodId').isMongoId().withMessage('Invalid food ID'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

export const cartItemIdValidator = [param('foodId').isMongoId().withMessage('Invalid food ID')];
