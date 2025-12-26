import dotenv from 'dotenv';

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
    origin: string | ((origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void);
  };
}

// Dynamic CORS origin validator
const getCorsOrigin = () => {
  const nodeEnv = process.env.NODE_ENV;

  // In production, use dynamic validation
  if (nodeEnv === 'production') {
    return (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (mobile apps, curl, postman)
      if (!origin) {
        // CORS: No origin header - allowing
        return callback(null, true);
      }

      // Allow all Vercel deployments (*.vercel.app)
      if (origin.endsWith('.vercel.app')) {
        // CORS: Allowed Vercel deployment
        return callback(null, true);
      }

      // Allow custom domain (tcetesummit.in and www.tcetesummit.in)
      const customDomains = ['https://tcetesummit.in', 'https://www.tcetesummit.in'];
      if (customDomains.includes(origin)) {
        // CORS: Allowed custom domain
        return callback(null, true);
      }

      // Allow explicit frontend URL from env
      const frontendUrl = process.env.FRONTEND_URL;
      if (frontendUrl && origin === frontendUrl) {
        // CORS: Allowed explicit frontend
        return callback(null, true);
      }

      // Allow ALLOWED_ORIGINS from env (comma-separated)
      const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim());
      if (allowedOrigins && allowedOrigins.includes(origin)) {
        // CORS: Allowed from ALLOWED_ORIGINS
        return callback(null, true);
      }

      // Allow localhost in production (for testing)
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        // CORS: Allowed localhost
        return callback(null, true);
      }

      // Reject other origins
      logger.warn(`⚠️ CORS (prod): Blocked origin - ${origin}`);
      return callback(new Error('Not allowed by CORS'), false);
    };
  }

  // In development, allow localhost and Vercel
  if (nodeEnv === 'development') {
    return (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      const devOrigins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
        'http://localhost:5000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5000',
      ];

      // Allow requests with no origin (Postman, curl, mobile apps)
      if (!origin) {
        return callback(null, true);
      }

      // Allow any localhost/127.0.0.1 port
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        // CORS: Allowed localhost (dev)
        return callback(null, true);
      }

      // Allow Vercel deployments
      if (origin.endsWith('.vercel.app')) {
        // CORS: Allowed Vercel (dev)
        return callback(null, true);
      }

      // Allow if matches explicit origin
      if (devOrigins.includes(origin)) {
        // CORS: Allowed explicit (dev)
        return callback(null, true);
      }

      // In development, log but still allow
      logger.warn(`⚠️ CORS (dev): Unknown origin, but allowing - ${origin}`);
      return callback(null, true);
    };
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
