/**
 * Simple logger utility for production-ready logging
 * Replaces console.log/error with proper logging that can be controlled in production
 */

type LogLevel = 'log' | 'warn' | 'error' | 'debug';

const isDevelopment = import.meta.env?.MODE === 'development' || import.meta.env?.DEV === true;
const isProduction = import.meta.env?.MODE === 'production' || import.meta.env?.PROD === true;

class Logger {
  private shouldLog(level: LogLevel): boolean {
    // In production, only log errors
    if (isProduction && level !== 'error') {
      return false;
    }
    return true;
  }

  log(...args: unknown[]): void {
    if (this.shouldLog('log')) {
      // eslint-disable-next-line no-console
      console.log('[LOG]', ...args);
    }
  }

  warn(...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      // eslint-disable-next-line no-console
      console.warn('[WARN]', ...args);
    }
  }

  error(...args: unknown[]): void {
    // Always log errors
    // eslint-disable-next-line no-console
    console.error('[ERROR]', ...args);
  }

  debug(...args: unknown[]): void {
    if (this.shouldLog('debug') && isDevelopment) {
      // eslint-disable-next-line no-console
      console.debug('[DEBUG]', ...args);
    }
  }
}

export const logger = new Logger();
export default logger;

