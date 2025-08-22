import { Request, Response } from 'express';
import { config } from './config';

export class HealthController {
  async getHealth(_req: Request, res: Response): Promise<void> {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      tableSize: config.tableSize,
    });
  }
}
