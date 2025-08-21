import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  port: number;
  corsOrigin: string[];
  host: string;
  nodeEnv: string;
  logLevel: string;
  tableSize: number;
  pageSizeLimit: number;
}

export const config: Config = {
  port: parseInt(process.env.PORT || '3001', 10),
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((s) => s.trim()),
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  tableSize: parseInt(process.env.TABLE_SIZE || '1000000', 10),
  pageSizeLimit: parseInt(process.env.PAGE_SIZE_LIMIT || '100', 10),
};
