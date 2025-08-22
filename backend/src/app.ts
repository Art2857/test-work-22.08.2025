import express from 'express';
import { corsMiddleware, requestLogger, errorHandler } from './core/middleware';
import { HealthController } from './core/health-controller';
import { registerTableModule, createTableRoutes } from './modules/table';

export function createApp(): express.Application {
  const app = express();

  app.set('trust proxy', true);

  app.use(corsMiddleware);
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(requestLogger);

  registerTableModule();

  const healthController = new HealthController();
  app.get('/health', (req, res) => healthController.getHealth(req, res));

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
