import type { VercelRequest, VercelResponse } from '@vercel/node';

// Check if origin is allowed
const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return true; // Allow requests with no origin (postman, mobile apps, etc.)

  // Allow all Vercel deployments (*.vercel.app)
  if (origin.endsWith('.vercel.app')) {
    return true;
  }

  // Allow localhost for development
  if (origin.startsWith('http://localhost:')) {
    return true;
  }

  // Allow explicit frontend URL from env
  const frontendUrl = process.env.FRONTEND_URL;
  if (frontendUrl && origin === frontendUrl) {
    return true;
  }

  return false;
};

// Handler that returns a simple response first to test
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Get the origin from the request
    const origin = req.headers.origin as string | undefined;
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Check if origin is allowed and set appropriate header
    if (isOriginAllowed(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
    } else {
      // For security, don't allow the request
      res.setHeader('Access-Control-Allow-Origin', 'null');
      console.warn(`⚠️ CORS: Blocked origin - ${origin}`);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Origin'
    );

    // Handle preflight
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Simple health check for root and health endpoints
    if (req.url === '/' || req.url === '/api/v1/health') {
      return res.status(200).json({
        success: true,
        message: '🚀 E-Summit 2026 API is running on Vercel',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      });
    }

    // Import and use the Express app for other routes
    const app = (await import('../src/app')).default;
    
    // Call the Express app
    return app(req, res);
    
  } catch (error: any) {
    console.error('Serverless function error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message || 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
    });
  }
}
