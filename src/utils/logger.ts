import { format } from 'date-fns';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private static instance: Logger;
  private logs: string[] = [];
  private readonly maxLogs = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
    const dataString = data ? `\n${JSON.stringify(data, null, 2)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${dataString}`;
  }

  private log(level: LogLevel, message: string, data?: any) {
    const formattedMessage = this.formatMessage(level, message, data);
    
    // Store log
    this.logs.push(formattedMessage);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output
    switch (level) {
      case 'debug':
        console.debug(formattedMessage);
        break;
      case 'info':
        console.log(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'error':
        console.error(formattedMessage);
        break;
    }
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, error?: any) {
    this.log('error', message, {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error
    });
  }

  getLogs(): string[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();