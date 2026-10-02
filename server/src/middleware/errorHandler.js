import { AppError } from '../utils/AppError.js';

export const notFound = (_req, _res, next) => next(new AppError('Route not found', 404));

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  let { status = 500, message, errors } = err;

  if (err.code === 11000) {
    status = 409;
    message = 'An account with this email already exists';
    errors = { email: message };
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid identifier';
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Malformed JSON body';
  }

  if (status >= 500) {
    console.error(err);
    message = 'Something went wrong on our side. Please try again.';
  }

  res.status(status).json({ message, ...(errors && { errors }) });
};
