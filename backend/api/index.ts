import app from '../src/app';
import { connectDB } from '../src/config/database';

// Initialize database connection
let dbConnected = false;

async function initDB() {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error('Database initialization failed:', error);
    }
  }
}

// Initialize DB on cold start
initDB();

// Export the Express app for Vercel
export default app;
