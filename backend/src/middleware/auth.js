import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid authorization header' });
    }

    const token = header.split(' ')[1];
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
