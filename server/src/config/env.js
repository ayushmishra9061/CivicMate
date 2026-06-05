import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'https://civicmate.vercel.app,https://civicmate-quyqxfa1b-ayush-mishra-civicmate.vercel.app',
  mongoUri: process.env.MONGO_URI || 'mongodb+srv://rajamishra1609_db_user:fxq3ledbI5QEaReV@cluster0.qf0tyjc.mongodb.net/civicmate?retryWrites=true&w=majority',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'https://civicmate-k1b8.onrender.com',
  overpassUrl: process.env.OVERPASS_URL || 'https://overpass-api.de/api/interpreter'
};
