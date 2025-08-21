import { createApp } from './app';
import { config } from './core/config';
import { logger } from './common';

export function startServer(): void {
  const app = createApp();

  const server = app.listen(config.port, config.host, () => {
    logger.info(`🚀 Server running on ${config.host}:${config.port}`, {
      environment: config.nodeEnv,
      tableSize: config.tableSize.toLocaleString(),
      logLevel: config.logLevel,
    });
  });

  const gracefulShutdown = (signal: string) => {
    logger.info(`Received ${signal}, shutting down gracefully`);

    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Force closing server');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}
