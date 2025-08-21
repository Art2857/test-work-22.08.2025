import { startServer } from './server';
import { logger } from './common';

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

try {
  startServer();
} catch (error) {
  logger.error('Failed to start server:', error);
  process.exit(1);
}
