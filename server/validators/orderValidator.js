import { body, param } from 'express-validator';

export const createOrderValidator = [
  body('deliveryAddress.street').trim().notEmpty().withMessage('Street is required'),
  body('deliveryAddress.city').trim().notEmpty().withMessage('City is required'),
  body('deliveryAddress.state').trim().notEmpty().withMessage('State is required'),
  body('deliveryAddress.zipCode').trim().notEmpty().withMessage('Zip code is required'),
  body('paymentMethod').optional().isIn(['cod', 'card', 'upi']),
  body('couponCode').optional().trim(),
  body('notes').optional().trim().isLength({ max: 300 }),
];

export const updateOrderStatusValidator = [
  param('id').isMongoId().withMessage('Invalid order ID'),
  body('status')
    .isIn(['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'])
    .withMessage('Invalid status'),
];

export const orderIdValidator = [param('id').isMongoId().withMessage('Invalid order ID')];
