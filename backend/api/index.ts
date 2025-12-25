import type { VercelRequest, VercelResponse } from '@vercel/node';
import serverlessHttp from 'serverless-http';

// Initialize database connection for serverless (connect once, reuse)
import { connectDB } from '../src/config/database';

// Connect to database on cold start
let dbConnected = false;
const ensureDbConnection = async () => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
      console.log('✅ Database connected (serverless)');
    } catch (error) {
      console.error('❌ Database connection failed (serverless):', error);
      // Don't throw - let the app handle errors
    }
  }
};

// Lazy load the Express app
let app: any = null;
let handler: any = null;

const getApp = async () => {
  if (!app) {
    // Ensure DB connection before loading app
    await ensureDbConnection();
    
    // Import the Express app
    const expressApp = (await import('../src/app')).default;
    app = expressApp;
    
    // Wrap Express app with serverless-http for Vercel compatibility
    handler = serverlessHttp(app, {
      binary: ['image/*', 'application/pdf'],
    });
  }
  return handler;
};

// Vercel serverless function handler
export default async function vercelHandler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // Get the serverless-wrapped Express handler
    const appHandler = await getApp();
    
    // Call the serverless handler
    return appHandler(req, res);
  } catch (error: any) {
    console.error('❌ Serverless function error:', error);
    console.error('Error stack:', error?.stack);
    
    // Return proper error response
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' 
          ? error.message || 'An unexpected error occurred'
          : 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
