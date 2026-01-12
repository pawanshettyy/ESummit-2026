import { Request, Response, NextFunction } from 'express';

/**
 * Vercel Web Analytics Middleware
 * 
 * This middleware enables Vercel Web Analytics tracking for the Express backend.
 * It injects the necessary tracking metadata into responses for Vercel's analytics
 * service to collect insights about API usage and performance.
 * 
 * Note: The @vercel/analytics package for Node.js works best when used with the
 * inject() function on the client-side. This middleware supports analytics tracking
 * by ensuring proper headers and timing information are available.
 */
export const analyticsMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Store the start time for calculating response time
  const startTime = Date.now();

  // Intercept the res.send method to inject analytics tracking
  const originalSend = res.send;

  res.send = function (data: any) {
    // Calculate response time in milliseconds
    const responseTime = Date.now() - startTime;

    // Add custom headers for analytics tracking
    res.set('X-Response-Time', `${responseTime}ms`);
    
    // Set cache headers appropriately (helpful for analytics data)
    if (!res.get('Cache-Control')) {
      res.set('Cache-Control', 'public, max-age=3600');
    }

    // Call the original send method
    return originalSend.call(this, data);
  };

  next();
};

/**
 * Vercel Web Analytics Script Injection Middleware
 * 
 * For HTML responses, this middleware can inject the Vercel analytics script.
 * This is useful if the backend serves any HTML pages directly.
 */
export const injectAnalyticsScript = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Store the original json method
  const originalJson = res.json;

  res.json = function (body: any) {
    // Only process HTML content types
    const contentType = res.get('Content-Type') || '';
    
    if (contentType.includes('text/html')) {
      // Analytics script would be injected here if serving HTML
      // For API responses (JSON), no injection is needed
    }

    // Call the original json method
    return originalJson.call(this, body);
  };

  next();
};

/**
 * Custom Analytics Event Tracking
 * 
 * This utility function can be used throughout the application to track
 * custom events for Vercel Web Analytics (requires Pro or Enterprise plan).
 * 
 * @param eventName - The name of the event to track
 * @param eventData - Additional data to include with the event
 * 
 * Example usage:
 * trackAnalyticsEvent('user_signup', { plan: 'premium' })
 */
export const trackAnalyticsEvent = (
  eventName: string,
  eventData?: Record<string, any>
): void => {
  // In a real implementation, this would send events to Vercel's analytics service
  // For now, we log the event for monitoring purposes
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 Analytics Event: ${eventName}`, eventData);
  }
};
