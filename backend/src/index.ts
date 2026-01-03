import app from './app';

// Export the Express app for Vercel serverless functions
// Prisma connects lazily - no need to call connectDB() explicitly
export default app;
