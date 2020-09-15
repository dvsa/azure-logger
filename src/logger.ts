/* eslint-disable @typescript-eslint/no-explicit-any, lines-between-class-members */
import { Context } from '@azure/functions';
import winston, { Logger as WinstonLogger } from 'winston';
import Transport from 'winston-transport';
import config from './config';
import ILogger, { Props } from './ILogger';
import ApplicationInsightsTransport from './applicationInsightsTransport';
import { LOG_LEVELS } from './enums';
import getOperationId from './helpers/getOperationId';
import { getServiceBusParentId, getServiceBusOperationId } from './helpers/serviceBusHelper';

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
      [LOG_LEVELS.REQUEST]: 7,
      [LOG_LEVELS.DEPENDENCY]: 8,
      [LOG_LEVELS.EVENT]: 9,
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

  critical(message: string, properties?: Props): void;
  critical(context: Context, message: string, properties?: Props): void;
  critical(...args: any[]): void {
    const { message, properties } = this.parseArgs(args);
    this.loggerInstance.log(LOG_LEVELS.CRITICAL, message, properties);
  }

  debug(message: string, properties?: Props): void;
  debug(context: Context, message: string, properties?: Props): void;
  debug(...args: any[]): void {
    const { message, properties } = this.parseArgs(args);
    this.loggerInstance.log(LOG_LEVELS.DEBUG, message, properties);
  }

  audit(message: string, properties?: Props): void;
  audit(context: Context, message: string, properties?: Props): void;
  audit(...args: any[]): void {
    const { message, properties } = this.parseArgs(args);
    this.loggerInstance.log(LOG_LEVELS.AUDIT, message, properties);
  }

  security(message: string, properties?: Props): void;
  security(context: Context, message: string, properties?: Props): void;
  security(...args: any[]): void {
    const { message, properties } = this.parseArgs(args);
    this.loggerInstance.log(LOG_LEVELS.SECURITY, message, properties);
  }

  log(message: string, properties?: Props): void;
  log(context: Context, message: string, properties?: Props): void;
  log(...args: any[]): void {
    const { message, properties } = this.parseArgs(args);
    this.loggerInstance.log(LOG_LEVELS.INFO, message, properties);
  }

  info(message: string, properties?: Props): void;
  info(context: Context, message: string, properties?: Props): void;
  info(...args: any[]): void {
    const { message, properties } = this.parseArgs(args);
    this.loggerInstance.log(LOG_LEVELS.INFO, message, properties);
  }

  warn(message: string, properties?: Props): void;
  warn(context: Context, message: string, properties?: Props): void;
  warn(...args: any[]): void {
    const { message, properties } = this.parseArgs(args);
    this.loggerInstance.log(LOG_LEVELS.WARNING, message, properties);
  }

  error(error: Error, message?: string, properties?: Props): void;
  error(context: Context, error: Error, message?: string, properties?: Props): void;
  error(...args: any[]): void {
    let context;
    let error;
    let message;
    let properties;

    if (args[0] instanceof Error) { // Method signature #1 with error first arg
      [error, message, properties] = args;
    } else { // #2 with context first arg
      [context, error, message, properties] = args;
    }

    this.loggerInstance.error(message || '', {
      error,
      ...this.extendProps(properties, context),
    });
  }

  event(name: string, message?: string, properties?: Props): void;
  event(context: Context, name: string, message?: string, properties?: Props): void;
  event(...args: any[]): void {
    let context;
    let name;
    let message;
    let properties;

    if (typeof args[0] === 'string') { // Method signature #1 with name first arg
      [name, message, properties] = args;
    } else { // #2 with context first arg
      [context, name, message, properties] = args;
    }

    this.loggerInstance.log(LOG_LEVELS.EVENT, message || '', {
      name,
      ...this.extendProps(properties, context),
    });
  }

  dependency(context: Context, name: string, data?: string, properties?: Props): void {
    this.loggerInstance.log(LOG_LEVELS.DEPENDENCY, name || 'Dependency', {
      name,
      data,
      ...this.extendProps(properties, context),
    });
  }

  request(context: Context, name: string, properties?: Props): void {
    this.loggerInstance.log(LOG_LEVELS.REQUEST, name || 'Request', {
      name,
      ...this.extendProps(properties, context),
    });
  }

  private parseArgs(args: any[]): { message: string; properties: object } {
    let context;
    let message;
    let properties;

    if (typeof args[0] === 'string') { // Method signature #1 with message first arg
      [message, properties] = args;
    } else { // #2 with context first arg
      [context, message, properties] = args;
    }

    return {
      message,
      properties: this.extendProps(properties, context),
    };
  }

  private extendProps(properties?: Props, context?: Context): Props {
    let traceIds;
    if (context) {
      traceIds = { // Context provided so set trace ids for manual correlation
        operationId: getOperationId(context),
        sbOperationId: getServiceBusOperationId(context),
        sbParentId: getServiceBusParentId(context),
      };
    }

    return {
      projectName: this.projectName,
      componentName: this.componentName,
      ...traceIds,
      ...properties,
    };
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
