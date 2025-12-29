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
import express, { Application } from 'express';
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
  contentSecurityPolicy: false, // Disable for API
}));

// CORS
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
    allowedHeaders: ['x-admin-secret', 'content-type', 'authorization', 'x-requested-with'],
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Clerk authentication middleware - MUST be before routes
app.use(clerkAuth);

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
