import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.util';

/**
 * General API rate limiter
 * 300 requests per 15 minutes per IP (500 in development)
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 300 : 500, // Higher limit in development
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later.',
    });
  },
});

/**
 * Strict rate limiter for authentication routes
 * 5 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later.',
  },
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many authentication attempts, please try again later.',
    });
  },
});

/**
 * Payment route rate limiter
 * 10 payment attempts per hour per IP
 */
export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 payment attempts per hour
  message: {
    success: false,
    error: 'Too many payment attempts, please try again later.',
  },
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    logger.warn(`Payment rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many payment attempts, please try again later.',
    });
  },
});

/**
 * QR Code scanning rate limiter
 * 50 scans per minute per IP (for busy check-in counters)
 */
export const scannerLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // Limit each IP to 50 scans per minute
  message: {
    success: false,
    error: 'Too many scan requests, please slow down.',
  },
  skipSuccessfulRequests: true, // Don't count successful scans
  handler: (req, res) => {
    logger.warn(`Scanner rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many scan requests, please slow down.',
    });
  },
});

/**
 * Webhook rate limiter
 * 100 webhooks per minute (for high-volume events)
 */
export const webhookLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: {
    success: false,
    error: 'Webhook rate limit exceeded.',
  },
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    logger.warn(`Webhook rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Webhook rate limit exceeded.',
    });
  },
});
