import passport from '../config/passport.js';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (await User.exists({ email })) {
    throw new AppError('An account with this email already exists', 409, {
      email: 'An account with this email already exists',
    });
  }
  const user = await User.create({ name, email, password });
  req.login(user, (err) => (err ? next(err) : res.status(201).json({ user })));
});

export const login = (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) return next(err);
    if (!user) return next(new AppError('Invalid email or password', 401));
    req.login(user, (loginErr) => (loginErr ? next(loginErr) : res.json({ user })));
  })(req, res, next);
};

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('helpdesk.sid', { sameSite: env.cookieSameSite, secure: env.isProd });
      res.json({ message: 'Logged out' });
    });
  });
};

export const me = (req, res) => res.json({ user: req.isAuthenticated() ? req.user : null });
