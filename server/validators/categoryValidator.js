import { body, param } from 'express-validator';

export const createCategoryValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }),
  body('description').optional().trim().isLength({ max: 200 }),
];

export const updateCategoryValidator = [
  param('id').isMongoId().withMessage('Invalid category ID'),
  body('name').optional().trim().notEmpty().isLength({ max: 50 }),
  body('description').optional().trim().isLength({ max: 200 }),
  body('isActive').optional().isBoolean(),
];

export const categoryIdValidator = [param('id').isMongoId().withMessage('Invalid category ID')];
