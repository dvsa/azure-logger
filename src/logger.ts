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

  critical(message: string, properties?: {[key: string]: string}): void {
    this.loggerInstance.log(LOG_LEVELS.CRITICAL, message, {
      projectName: this.projectName,
      componentName: this.componentName,
      ...properties,
    });
  }

  debug(message: string, properties?: {[key: string]: string}): void {
    this.loggerInstance.log(LOG_LEVELS.DEBUG, message, {
      projectName: this.projectName,
      componentName: this.componentName,
      ...properties,
    });
  }

  audit(message: string, properties?: {[key: string]: string}): void {
    this.loggerInstance.log(LOG_LEVELS.AUDIT, message, {
      projectName: this.projectName,
      componentName: this.componentName,
      ...properties,
    });
  }

  security(message: string, properties?: {[key: string]: string}): void {
    this.loggerInstance.log(LOG_LEVELS.SECURITY, message, {
      projectName: this.projectName,
      componentName: this.componentName,
      ...properties,
    });
  }

  error(error: Error, message?: string, properties?: {[key: string]: string}): void {
    this.loggerInstance.error(message || '', {
      error,
      projectName: this.projectName,
      componentName: this.componentName,
      ...properties,
    });
  }

  info(message: string, properties?: {[key: string]: string}): void {
    this.loggerInstance.info(message, {
      projectName: this.projectName,
      componentName: this.componentName,
      ...properties,
    });
  }

  log(message: string, properties?: {[key: string]: string}): void {
    this.loggerInstance.log(LOG_LEVELS.INFO, message, {
      projectName: this.projectName,
      componentName: this.componentName,
      ...properties,
    });
  }

  warn(message: string, properties?: {[key: string]: string}): void {
    this.loggerInstance.log(LOG_LEVELS.WARNING, message, {
      projectName: this.projectName,
      componentName: this.componentName,
      ...properties,
    });
  }

  event(name: string, message?: string, properties?: {[key: string]: string}): void {
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
      );
    } else {
      if (!config.applicationInsights.key) {
        throw new Error('No Application Insights Key provided in APPINSIGHTS_INSTRUMENTATIONKEY');
      }
      transports.push(
        new ApplicationInsightsTransport({
          key: config.applicationInsights.key,
          componentName: this.componentName,
          level: config.logs.level,
        }),
      );
    }

    return transports;
  }
}

export default Logger;
