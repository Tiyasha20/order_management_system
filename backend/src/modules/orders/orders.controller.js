import * as ordersService from './orders.service.js';

export const createOrder = async (req, res, next) => {
  try {
    const order = await ordersService.createOrder(req.user.id, req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const listOrders = async (req, res, next) => {
  try {
    const result = await ordersService.listOrders(req.user, req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await ordersService.getOrderById(req.params.id, req.user);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await ordersService.cancelOrder(req.params.id, req.user);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const order = await ordersService.updateStatus(req.params.id, req.body.status);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
