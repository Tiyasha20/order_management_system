import mongoose from 'mongoose';
import { AppError } from '../../middleware/errorHandler.js';
import { Order } from '../../models/Order.model.js';

const progression = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

export const createOrder = async (userId, payload) => {
  return Order.create({ ...payload, userId, status: 'PENDING' });
};

export const listOrders = async (user, query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const filter = {};

  if (user.role === 'customer') {
    filter.userId = user.id;
  } else {
    if (query.status) filter.status = query.status;
    if (query.search && mongoose.Types.ObjectId.isValid(query.search)) filter._id = query.search;
  }

  const [data, total] = await Promise.all([
    Order.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Order.countDocuments(filter)
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
};

export const getOrderById = async (id, user) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Order not found', 404);
  }

  const order = await Order.findById(id).populate('userId', 'name email');
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (user.role === 'customer' && order.userId._id.toString() !== user.id) {
    throw new AppError('Forbidden', 403);
  }

  return order;
};

export const cancelOrder = async (id, user) => {
  const order = await getOrderById(id, user);
  if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
    throw new AppError('Only pending or confirmed orders can be cancelled', 400);
  }

  order.status = 'CANCELLED';
  await order.save();
  return order;
};

export const updateStatus = async (id, status) => {
  if (!progression.includes(status)) {
    throw new AppError('Invalid status', 400);
  }

  const order = await getOrderById(id, { role: 'admin' });
  if (order.status === 'CANCELLED') {
    throw new AppError('Cancelled orders cannot be updated', 400);
  }

  const currentIndex = progression.indexOf(order.status);
  const nextIndex = progression.indexOf(status);
  if (nextIndex !== currentIndex + 1) {
    throw new AppError('Status can only move to the next step', 400);
  }

  order.status = status;
  await order.save();
  return order;
};
