import { env } from '../config/env.js';

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const body = { message: err.message || 'Internal Server Error' };

  if (env.nodeEnv === 'development') {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
};
