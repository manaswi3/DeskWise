import { AppError } from '../utils/AppError.js';

export const requireAuth = (req, _res, next) =>
  req.isAuthenticated() ? next() : next(new AppError('Please log in to continue', 401));

export const requireAdmin = (req, _res, next) =>
  req.user?.role === 'admin' ? next() : next(new AppError('Admin access required', 403));
