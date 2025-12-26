import app from './app';
import { connectDB } from './config/database';

// Initialize database connection for serverless
connectDB().catch((error) => {
  logger.error('Database connection failed:', error);
});

// Export the Express app for Vercel serverless functions
export default app;
