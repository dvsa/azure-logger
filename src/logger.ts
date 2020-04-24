/* eslint-disable @typescript-eslint/no-explicit-any */
import winston, { Logger as WinstonLogger } from 'winston';
import Transport from 'winston-transport';
import config from './config';
import ILogger from './ILogger';
import ApplicationInsightsTransport from './applicationInsightsTransport';
import { LOG_LEVELS } from './enums';

class Logger implements ILogger {
  private loggerInstance: WinstonLogger;

  constructor(private projectName: string, private componentName: string) {
    const transports = this.getWinstonTransports();
    const customLevels = {
      [LOG_LEVELS.CRITICAL]: 0,
      [LOG_LEVELS.ERROR]: 1,
      [LOG_LEVELS.WARNING]: 2,
      [LOG_LEVELS.INFO]: 3,
      [LOG_LEVELS.DEBUG]: 4,
      [LOG_LEVELS.SECURITY]: 5,
      [LOG_LEVELS.AUDIT]: 6,
      [LOG_LEVELS.EVENT]: 7,
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
    this.loggerInstance.log(LOG_LEVELS.CRITICAL, message, {
      projectName: this.projectName,
      componentName: this.componentName,
      ...optionalParams,
    });
  }

  debug(message: string, ...optionalParams: any[]): void {
    this.loggerInstance.log(LOG_LEVELS.DEBUG, message, {
      projectName: this.projectName,
      componentName: this.componentName,
      ...optionalParams,
    });
  }

  audit(message: string, ...optionalParams: any[]): void {
    this.loggerInstance.log(LOG_LEVELS.AUDIT, message, {
      projectName: this.projectName,
      componentName: this.componentName,
      ...optionalParams,
    });
  }

  security(message: string, ...optionalParams: any[]): void {
    this.loggerInstance.log(LOG_LEVELS.SECURITY, message, {
      projectName: this.projectName,
      componentName: this.componentName,
      ...optionalParams,
    });
  }

  error(message: string, ...optionalParams: any[]): void {
    this.loggerInstance.error(message, {
      projectName: this.projectName,
      componentName: this.componentName,
      ...optionalParams,
    });
  }

  info(message: string, ...optionalParams: any[]): void {
    this.loggerInstance.info(message, {
      projectName: this.projectName,
      componentName: this.componentName,
      ...optionalParams,
    });
  }

  log(message: string, ...optionalParams: any[]): void {
    this.loggerInstance.log(LOG_LEVELS.INFO, message, {
      projectName: this.projectName,
      componentName: this.componentName,
      ...optionalParams,
    });
  }

  warn(message: string, ...optionalParams: any[]): void {
    this.loggerInstance.log(LOG_LEVELS.WARNING, message, {
      projectName: this.projectName,
      componentName: this.componentName,
      ...optionalParams,
    });
  }

  event(name: string, message?: string, properties?: {[key: string]: any}): void {
    this.loggerInstance.log(LOG_LEVELS.EVENT, message || '', {
      name,
      projectName: this.projectName,
      componentName: this.componentName,
      ...properties,
    });
  }

  private getWinstonTransports(): Transport[] {
    const transports: Transport[] = [];

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
