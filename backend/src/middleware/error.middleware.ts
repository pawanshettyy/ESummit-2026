import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util';
import logger from '../utils/logger.util';

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Error:', err);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Prisma errors
  if (err.code === 'P2002') {
    statusCode = 400;
    message = 'A record with this value already exists';
  } else if (err.code === 'P2026') {
    statusCode = 404;
    message = 'Record not found';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  sendError(res, message, statusCode, err.stack);
};

/**
 * 404 Not Found handler
 */
export const notFound = (req: Request, res: Response, _next: NextFunction): void => {
  sendError(res, `Route ${req.originalUrl} not found`, 404);
};
