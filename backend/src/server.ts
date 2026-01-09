import app from './app';
import config from './config';
import { connectDB, disconnectDB } from './config/database';
import logger from './utils/logger.util';
import { ScheduledTasksService } from './services/scheduled-tasks.service';

const PORT = config.port;

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Initialize scheduled tasks
    ScheduledTasksService.getInstance();

    // Start listening
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running in ${config.env} mode on port ${PORT}`);
      logger.info(`📍 API: http://localhost:${PORT}/api/v1`);
      logger.info(`💚 Health: http://localhost:${PORT}/api/v1/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = async () => {
      logger.info('Received shutdown signal, closing server gracefully...');

      server.close(async () => {
        logger.info('HTTP server closed');

        await disconnectDB();
        logger.info('Database disconnected');

        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
