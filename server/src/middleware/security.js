import compression from 'compression';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss';
import { env } from '../config/env.js';

const sanitizeValue = (value) => {
  if (typeof value === 'string') return xss(value);
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, sanitizeValue(child)]));
  }
  return value;
};

const xssProtection = (req, _res, next) => {
  req.body = sanitizeValue(req.body);
  req.params = sanitizeValue(req.params);
  next();
};

export const securityMiddleware = [
  helmet(),
  compression(),
  cors({
    origin: env.clientUrl.split(',').map((origin) => origin.trim()),
    credentials: true
  }),
  mongoSanitize(),
  xssProtection,
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
];
