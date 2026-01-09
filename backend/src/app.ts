// Initialize Sentry FIRST, before any other imports
import * as Sentry from '@sentry/node';

// Read Sentry configuration from environment variables
const SENTRY_DSN = process.env.SENTRY_DSN || '';
const SENTRY_TRACES_SAMPLE_RATE = parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1');
const SENTRY_PROFILES_SAMPLE_RATE = parseFloat(process.env.SENTRY_PROFILES_SAMPLE_RATE || '0.1');

if (SENTRY_DSN) {
  try {
    Sentry.init({
      dsn: SENTRY_DSN,
      tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,
      profilesSampleRate: SENTRY_PROFILES_SAMPLE_RATE as any,
      environment: process.env.NODE_ENV || 'development',
    });
    
    // Sentry initialized
  } catch (error) {
    console.warn('⚠️ Sentry initialization failed:', error);
  }
}

// Now import Express and other modules
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config';
import routes from './routes';
import { errorHandler, notFound } from './middleware/error.middleware';
import { generalLimiter } from './middleware/rateLimit.middleware';
import { clerkAuth } from './middleware/clerk.middleware';


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

// CORS - more permissive configuration
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
    allowedHeaders: ['x-admin-secret', 'content-type', 'authorization', 'x-requested-with', 'accept', 'cache-control', 'origin', 'x-requested-with'],
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

// Clerk authentication middleware - run Clerk unless admin-secret is present
app.use((req: Request, res: Response, next: NextFunction) => {
  try {
    const xAdminSecret = (req.headers['x-admin-secret'] as any) || '';
    const expectedAdminSecret = process.env.ADMIN_IMPORT_SECRET || 'esummit2026-admin-import';

    // If admin secret is present in x-admin-secret, skip Clerk
    if (xAdminSecret && xAdminSecret === expectedAdminSecret) {
      return next();
    }

    // Otherwise, run Clerk middleware
    return clerkAuth(req as any, res as any, next);
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
app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: '🚀 Welcome to E-Summit 2026 API',
    version: '1.0.0',
    documentation: '/api/v1/health',
  });
});

// Favicon route (prevent 404 errors from Vercel)
app.get('/favicon.ico', (_req: Request, res: Response) => res.status(204).end());
app.get('/favicon.png', (_req: Request, res: Response) => res.status(204).end());

// 404 handler
app.use(notFound);

// Sentry error handler (must be before other error handlers)
if (SENTRY_DSN) {
  try {
    // Use Sentry's error handler middleware - pass app to setup
    Sentry.setupExpressErrorHandler(app);
  } catch (error) {
    console.warn('⚠️ Sentry error handler setup failed:', error);
  }
}

// Error handler (must be last)
app.use(errorHandler);

export default app;
