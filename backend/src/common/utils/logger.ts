import { config } from '../../core/config';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const LOG_LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const COLORS: Record<LogLevel, string> = {
  error: '\x1b[31m',
  warn: '\x1b[33m',
  info: '\x1b[36m',
  debug: '\x1b[90m',
};

class Logger {
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] <= LOG_LEVELS[config.logLevel as LogLevel];
  }

  private log(level: LogLevel, message: string, data?: any): void {
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    const color = COLORS[level];
    const reset = '\x1b[0m';

    console.log(
      `${color}[${timestamp}] ${level.toUpperCase()}: ${message}${reset}`,
      data || ''
    );
  }

  error(message: string, data?: any): void {
    this.log('error', message, data);
  }

  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }
}

export const logger = new Logger();
