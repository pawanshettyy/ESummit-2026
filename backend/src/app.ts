// Now import Express and other modules
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config';
import routes from './routes';
import { errorHandler, notFound } from './middleware/error.middleware';
import { generalLimiter } from './middleware/rateLimit.middleware';
import { clerkAuth } from './middleware/clerk.middleware';
import { analyticsMiddleware } from './middleware/analytics.middleware';


const app: Application = express();

// Trust proxy - REQUIRED for Vercel/serverless environments
// This allows express-rate-limit to correctly identify users via X-Forwarded-For header
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // For CSS
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"], // Allow data URLs and HTTPS images
      connectSrc: ["'self'"], // For API calls
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        'https://tcetesummit.in',
        'https://www.tcetesummit.in',
        'https://api.tcetesummit.in',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
        'http://localhost:5000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5000',
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    allowedHeaders: ['x-admin-secret', 'content-type', 'authorization', 'x-requested-with', 'accept', 'cache-control', 'origin'],
    exposedHeaders: ['x-admin-secret', 'authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    optionsSuccessStatus: 200,
    preflightContinue: false,
  })
);

// Handle preflight requests explicitly
app.options('*', cors());

// Body parsers - MUST be before any middleware that reads req.body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Vercel Web Analytics middleware - tracks response times and performance metrics
app.use(analyticsMiddleware);

// Clerk authentication middleware - run Clerk unless admin-secret is present
app.use((req, res, next) => {
  try {
    const xAdminSecret = (req.headers['x-admin-secret'] as string) || '';
    const expectedAdminSecret = process.env.ADMIN_IMPORT_SECRET || 'esummit2026-admin-import';

    // If admin secret is present in x-admin-secret, skip Clerk
    if (xAdminSecret && xAdminSecret === expectedAdminSecret) {
      return next();
    }

    // Otherwise, run Clerk middleware
    return clerkAuth(req, res, next);
  } catch (e) {
    return next();
  }
});

// HTTP request logger
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Global rate limiting - applies to all API routes
app.use('/api/', generalLimiter);

// API routes
app.use('/api/v1', routes);

// Root route
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: '🚀 Welcome to E-Summit 2026 API',
    version: '1.0.0',
    documentation: '/api/v1/health',
  });
});

// Favicon route (prevent 404 errors from Vercel)
app.get('/favicon.ico', (_req, res) => res.status(204).end());
app.get('/favicon.png', (_req, res) => res.status(204).end());

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

export default app;
