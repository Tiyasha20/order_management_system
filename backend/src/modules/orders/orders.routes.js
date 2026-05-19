import express from 'express';
import { body, query } from 'express-validator';
import { auth } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/requireRole.js';
import { validate } from '../../middleware/validate.js';
import * as ordersController from './orders.controller.js';

export const ordersRouter = express.Router();

ordersRouter.use(auth);

ordersRouter.post(
  '/',
  requireRole('customer'),
  [
    body('pickupAddress').trim().notEmpty().withMessage('Pickup address is required'),
    body('deliveryAddress').trim().notEmpty().withMessage('Delivery address is required'),
    body('packageType').isIn(['document', 'parcel', 'fragile', 'heavy']).withMessage('Invalid package type'),
    body('weight').isFloat({ min: 0.1 }).withMessage('Weight must be at least 0.1'),
    body('estimatedDeliveryDate').isISO8601().withMessage('Valid estimated delivery date is required')
  ],
  validate,
  ordersController.createOrder
);

ordersRouter.get(
  '/',
  [
    query('status').optional({ checkFalsy: true }).isIn(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional({ checkFalsy: true }).trim()
  ],
  validate,
  ordersController.listOrders
);

ordersRouter.get('/:id', ordersController.getOrder);
ordersRouter.patch('/:id/cancel', requireRole('customer'), ordersController.cancelOrder);
ordersRouter.patch(
  '/:id/status',
  requireRole('admin'),
  [body('status').isIn(['CONFIRMED', 'SHIPPED', 'DELIVERED']).withMessage('Invalid status')],
  validate,
  ordersController.updateStatus
);
