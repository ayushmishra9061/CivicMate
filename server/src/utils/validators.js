import { validationResult } from 'express-validator';
import { ApiError } from './errors.js';

export const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(422, errors.array().map((error) => error.msg).join(', ')));
  }
  return next();
};
