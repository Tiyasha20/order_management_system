import express from 'express';
import { body } from 'express-validator';
import { validate } from '../../middleware/validate.js';
import * as authController from './auth.controller.js';

export const authRouter = express.Router();

authRouter.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['admin', 'customer']).withMessage('Invalid role')
  ],
  validate,
  authController.signup
);

authRouter.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  authController.login
);
