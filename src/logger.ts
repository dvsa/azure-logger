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

  critical(message: string, properties?: Props): void {
    const props = this.extendProps(properties);
    this.loggerInstance.log(LOG_LEVELS.CRITICAL, message, props);
  }

  debug(message: string, properties?: Props): void {
    const props = this.extendProps(properties);
    this.loggerInstance.log(LOG_LEVELS.DEBUG, message, props);
  }

  audit(message: string, properties?: Props): void {
    const props = this.extendProps(properties);
    this.loggerInstance.log(LOG_LEVELS.AUDIT, message, props);
  }

  security(message: string, properties?: Props): void {
    const props = this.extendProps(properties);
    this.loggerInstance.log(LOG_LEVELS.SECURITY, message, props);
  }

  log(message: string, properties?: Props): void {
    this.info(message, properties);
  }

  info(message: string, properties?: Props): void {
    const props = this.extendProps(properties);
    this.loggerInstance.log(LOG_LEVELS.INFO, message, props);
  }

  warn(message: string, properties?: Props): void {
    const props = this.extendProps(properties);
    this.loggerInstance.log(LOG_LEVELS.WARNING, message, props);
  }

  error(error: Error, message?: string, properties?: Props): void {
    const props = this.extendProps(properties);
    this.loggerInstance.error(message || '', {
      error,
      ...props,
    });
  }

  event(name: string, message?: string, properties?: Props): void {
    const props = this.extendProps(properties);
    this.loggerInstance.log(LOG_LEVELS.EVENT, message || '', {
      name,
      ...props,
    });
  }

  dependency(context: Context, name: string, data?: string, properties?: Props): void {
    const props = this.extendProps(properties, context);
    this.loggerInstance.log(LOG_LEVELS.DEPENDENCY, name || 'Dependency', {
      name,
      data,
      ...props,
    });
  }

  request(context: Context, name: string, properties?: Props): void {
    const props = this.extendProps(properties, context);
    this.loggerInstance.log(LOG_LEVELS.REQUEST, name || 'Request', {
      name,
      ...props,
    });
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
