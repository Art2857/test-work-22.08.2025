import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config';
import { logger } from '../common';

export const corsMiddleware = cors({
  origin: config.corsOrigin,
  credentials: true,
});

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.url}`, {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
}

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error('Request error', {
    error: error.message,
    url: req.url,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
}
