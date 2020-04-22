/* eslint-disable @typescript-eslint/no-explicit-any */
import winston, { Logger as WinstonLogger } from 'winston';
import config from './config';
import ILogger from './ILogger';
import { ApplicationInsightsTransport } from './applicationInsightsTransport';

export enum LOG_LEVELS {
  CRITICAL = 'crit',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  DEBUG = 'debug',
  SECURITY = 'security',
  AUDIT = 'audit'
}

class Logger implements ILogger {
  private loggerInstance: WinstonLogger;

  constructor() {
    const transports = this.getWinstonTransports();
    const customLevels = {
      [LOG_LEVELS.CRITICAL]: 0,
      [LOG_LEVELS.ERROR]: 1,
      [LOG_LEVELS.WARNING]: 2,
      [LOG_LEVELS.INFO]: 3,
      [LOG_LEVELS.DEBUG]: 4,
      [LOG_LEVELS.SECURITY]: 5,
      [LOG_LEVELS.AUDIT]: 6,
    };

    this.loggerInstance = winston.createLogger({
      level: config.logs.level,
      levels: customLevels,
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.json(),
      ),
      transports,
    });
  }

  critical(message: string, ...optionalParams: any[]): void {
    this.loggerInstance.log(LOG_LEVELS.CRITICAL, message, ...optionalParams);
  }

  debug(message: string, ...optionalParams: any[]): void {
    this.loggerInstance.log(LOG_LEVELS.DEBUG, message, ...optionalParams);
  }

  audit(message: string, ...optionalParams: any[]): void {
    this.loggerInstance.log(LOG_LEVELS.AUDIT, message, ...optionalParams);
  }

  security(message: string, ...optionalParams: any[]): void {
    this.loggerInstance.log(LOG_LEVELS.SECURITY, message, ...optionalParams);
  }

  error(message: string, ...optionalParams: any[]): void {
    this.loggerInstance.error(message, ...optionalParams);
  }

  info(message: string, ...optionalParams: any[]): void {
    this.loggerInstance.info(message, ...optionalParams);
  }

  log(message: string, ...optionalParams: any[]): void {
    this.loggerInstance.log(LOG_LEVELS.INFO, message, ...optionalParams);
  }

  warn(message: string, ...optionalParams: any[]): void {
    this.loggerInstance.log(LOG_LEVELS.WARNING, message, ...optionalParams);
  }

  private getWinstonTransports(): any[] {
    const transports: any[] = [];

    if (config.developmentMode) {
      transports.push(
        new winston.transports.Console({
          format: winston.format.simple(),
          level: config.logs.level,
        }),
        new ApplicationInsightsTransport({
          key: config.applicationInsights.key,
          level: config.logs.level,
        }),
      );
    } else {
      transports.push(
        new winston.transports.Console({
          format: winston.format.simple(),
          level: config.logs.level,
        }),
        new ApplicationInsightsTransport({
          key: config.applicationInsights.key,
          level: config.logs.level,
        }),
      );
    }

    return transports;
  }
}

export default Logger;
