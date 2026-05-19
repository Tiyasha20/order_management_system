import * as authService from './auth.service.js';

export const signup = async (req, res, next) => {
  try {
    const result = await authService.signup(req.body, req.headers['x-admin-key']);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
