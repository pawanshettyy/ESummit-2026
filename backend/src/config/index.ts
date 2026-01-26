import dotenv from 'dotenv';
import logger from '../utils/logger.util';

// Load environment variables
dotenv.config();

interface Config {
  env: string;
  port: number;
  databaseUrl: string;
  jwt: {
    secret: string;
    refreshSecret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  cors: {
    origin: string | string[] | RegExp[];
  };
}

// Dynamic CORS origin validator
const getCorsOrigin = (): string | string[] => {
  const nodeEnv = process.env.NODE_ENV;

  // In production, allow specific origins
  if (nodeEnv === 'production') {
    return [
      'https://tcetesummit.in',
      'https://www.tcetesummit.in',
      'https://api.tcetesummit.in',
    ];
  }

  // In development, allow localhost and Vercel
  if (nodeEnv === 'development') {
    return [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://localhost:5000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5000',
    ];
  }

  // Fallback to wildcard (not recommended for production)
  return '*';
};

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  jwt: {
    secret: process.env.JWT_SECRET || 'default-jwt-secret-please-change',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-please-change',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cors: {
    origin: getCorsOrigin(),
  },
};

// Warn about missing critical env vars in production
if (config.env === 'production') {
  if (!process.env.DATABASE_URL) {
    logger.warn('⚠️  WARNING: DATABASE_URL not set');
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('default')) {
    logger.warn('⚠️  WARNING: JWT_SECRET not set or using default');
  }
  if (!process.env.FRONTEND_URL) {
    logger.warn('⚠️  WARNING: FRONTEND_URL not set, using wildcard CORS');
  }
}

export default config;
