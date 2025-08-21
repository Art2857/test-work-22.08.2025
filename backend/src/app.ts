import express from 'express';
import { config } from './core/config';
import { corsMiddleware, requestLogger, errorHandler } from './core/middleware';
import { registerTableModule, createTableRoutes } from './modules/table';

export function createApp(): express.Application {
  const app = express();

  app.set('trust proxy', true);

  app.use(corsMiddleware);
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(requestLogger);

  registerTableModule();

  app.get('/health', (req, res) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      tableSize: config.tableSize,
    });
  });

  app.use('/api/table', createTableRoutes());

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Route not found',
      path: req.originalUrl,
    });
  });

  app.use(errorHandler);

  return app;
}
