/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context } from '@azure/functions';
import winston, { Logger as WinstonLogger } from 'winston';
import Transport from 'winston-transport';
import config from './config';
import ILogger from './ILogger';
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

  critical(context: Context, message: string, properties?: { [key: string]: string }): void {
    this.loggerInstance.log(LOG_LEVELS.CRITICAL, message, {
      projectName: this.projectName,
      componentName: this.componentName,
      operationId: getOperationId(context),
      sbOperationId: getServiceBusOperationId(context),
      sbParentId: getServiceBusParentId(context),
      ...properties,
    });
  }

  debug(context: Context, message: string, properties?: { [key: string]: string }): void {
    this.loggerInstance.log(LOG_LEVELS.DEBUG, message, {
      projectName: this.projectName,
      componentName: this.componentName,
      operationId: getOperationId(context),
      sbOperationId: getServiceBusOperationId(context),
      sbParentId: getServiceBusParentId(context),
      ...properties,
    });
  }

  audit(context: Context, message: string, properties?: { [key: string]: string }): void {
    this.loggerInstance.log(LOG_LEVELS.AUDIT, message, {
      projectName: this.projectName,
      componentName: this.componentName,
      operationId: getOperationId(context),
      sbOperationId: getServiceBusOperationId(context),
      sbParentId: getServiceBusParentId(context),
      ...properties,
    });
  }

  security(context: Context, message: string, properties?: { [key: string]: string }): void {
    this.loggerInstance.log(LOG_LEVELS.SECURITY, message, {
      projectName: this.projectName,
      componentName: this.componentName,
      operationId: getOperationId(context),
      sbOperationId: getServiceBusOperationId(context),
      sbParentId: getServiceBusParentId(context),
      ...properties,
    });
  }

  error(context: Context, error: Error, message?: string, properties?: { [key: string]: string }): void {
    this.loggerInstance.error(message || '', {
      error,
      projectName: this.projectName,
      componentName: this.componentName,
      operationId: getOperationId(context),
      sbOperationId: getServiceBusOperationId(context),
      sbParentId: getServiceBusParentId(context),
      ...properties,
    });
  }

  info(context: Context, message: string, properties?: { [key: string]: string }): void {
    this.loggerInstance.info(message, {
      projectName: this.projectName,
      componentName: this.componentName,
      operationId: getOperationId(context),
      sbOperationId: getServiceBusOperationId(context),
      sbParentId: getServiceBusParentId(context),
      ...properties,
    });
  }

  log(context: Context | undefined, message: string, properties?: { [key: string]: string }): void {
    let traceProps = {};
    if (context) {
      traceProps = {
        operationId: getOperationId(context),
        sbOperationId: getServiceBusOperationId(context),
        sbParentId: getServiceBusParentId(context),
      };
    }

    this.loggerInstance.log(LOG_LEVELS.INFO, message, {
      projectName: this.projectName,
      componentName: this.componentName,
      ...traceProps,
      ...properties,
    });
  }

  warn(context: Context, message: string, properties?: { [key: string]: string }): void {
    this.loggerInstance.log(LOG_LEVELS.WARNING, message, {
      projectName: this.projectName,
      componentName: this.componentName,
      operationId: getOperationId(context),
      sbOperationId: getServiceBusOperationId(context),
      sbParentId: getServiceBusParentId(context),
      ...properties,
    });
  }

  event(context: Context, name: string, message?: string, properties?: { [key: string]: string }): void {
    this.loggerInstance.log(LOG_LEVELS.EVENT, message || '', {
      name,
      projectName: this.projectName,
      componentName: this.componentName,
      operationId: getOperationId(context),
      sbOperationId: getServiceBusOperationId(context),
      sbParentId: getServiceBusParentId(context),
      ...properties,
    });
  }

  dependency(context: Context, name: string, data?: string, properties?: { [key: string]: any }): void {
    this.loggerInstance.log(LOG_LEVELS.DEPENDENCY, name || 'Dependency', {
      name,
      data,
      projectName: this.projectName,
      componentName: this.componentName,
      operationId: getOperationId(context),
      sbOperationId: getServiceBusOperationId(context),
      sbParentId: getServiceBusParentId(context),
      ...properties,
    });
  }

  request(context: Context, name: string, properties?: { [key: string]: any }): void {
    this.loggerInstance.log(LOG_LEVELS.REQUEST, name || 'Request', {
      name,
      projectName: this.projectName,
      componentName: this.componentName,
      operationId: getOperationId(context),
      sbOperationId: getServiceBusOperationId(context),
      sbParentId: getServiceBusParentId(context),
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
