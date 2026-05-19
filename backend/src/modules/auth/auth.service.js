import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { AppError } from '../../middleware/errorHandler.js';
import { User } from '../../models/User.model.js';

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
});

const signToken = (user) =>
  jwt.sign({ id: user._id, email: user.email, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });

export const signup = async ({ name, email, password, role }, adminKey) => {
  const desiredRole = role || 'customer';
  if (desiredRole === 'admin' && adminKey !== env.adminSignupKey) {
    throw new AppError('Admin signup key is invalid', 403);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError('Email is already registered', 400);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role: desiredRole });

  return { token: signToken(user), user: publicUser(user) };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new AppError('Invalid email or password', 401);
  }

  return { token: signToken(user), user: publicUser(user) };
};
