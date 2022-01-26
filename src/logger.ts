import { Context } from '@azure/functions';
import winston, { Logger as WinstonLogger } from 'winston';
import Transport from 'winston-transport';
import stringify from 'safe-stable-stringify';

import config from './config';
import ILogger, { Props } from './ILogger';
import ApplicationInsightsTransport from './applicationInsightsTransport';
import { LOG_LEVELS } from './enums';
import getOperationId from './helpers/getOperationId';
import { getServiceBusParentId, getServiceBusOperationId } from './helpers/serviceBusHelper';
import { CustomAxiosError } from './interfaces';
import { getDateFilename } from './helpers/getDate';

class Logger implements ILogger {
  private loggerInstance: WinstonLogger;

  constructor(private projectName: string, private componentName: string) {
    const transports = this.getWinstonTransports();
    const customLevels = {
      [LOG_LEVELS.CRITICAL]: 0,
      [LOG_LEVELS.ERROR]: 1,
      [LOG_LEVELS.WARNING]: 2,
      [LOG_LEVELS.EVENT]: 3,
      [LOG_LEVELS.REQUEST]: 4,
      [LOG_LEVELS.DEPENDENCY]: 5,
      [LOG_LEVELS.SECURITY]: 6,
      [LOG_LEVELS.AUDIT]: 7,
      [LOG_LEVELS.INFO]: 8,
      [LOG_LEVELS.DEBUG]: 9,
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
    const traceIds = this.getTraceIds(properties?.context);
    delete properties?.context;

    this.loggerInstance.log(LOG_LEVELS.CRITICAL, message, {
      projectName: this.projectName,
      componentName: this.componentName,
      ...properties,
      ...traceIds,
    });
  }

  debug(message: string, properties?: Props): void {
    const traceIds = this.getTraceIds(properties?.context);
    delete properties?.context;

    this.loggerInstance.log(LOG_LEVELS.DEBUG, message, {
      projectName: this.projectName,
      componentName: this.componentName,
      ...properties,
      ...traceIds,
    });
  }

  audit(message: string, properties?: Props): void {
    const traceIds = this.getTraceIds(properties?.context);
    delete properties?.context;

    this.loggerInstance.log(LOG_LEVELS.AUDIT, message, {
      projectName: this.projectName,
      componentName: this.componentName,
      ...properties,
      ...traceIds,
    });
  }

  security(message: string, properties?: Props): void {
    const traceIds = this.getTraceIds(properties?.context);
    delete properties?.context;

    this.loggerInstance.log(LOG_LEVELS.SECURITY, message, {
      projectName: this.projectName,
      componentName: this.componentName,
      ...properties,
      ...traceIds,
    });
  }

  error(error: Error, message?: string, properties?: Props): void {
    const traceIds = this.getTraceIds(properties?.context);
    delete properties?.context;

    let response;
    let httpStatus;
    if ((error as CustomAxiosError).isAxiosError !== undefined) {
      response = (error as CustomAxiosError).response?.data;
      httpStatus = (error as CustomAxiosError).response?.status;
    }

    this.loggerInstance.error(message || '', {
      projectName: this.projectName,
      componentName: this.componentName,
      error,
      response,
      httpStatus,
      ...properties,
      ...traceIds,
    });
  }

  info(message: string, properties?: Props): void {
    const traceIds = this.getTraceIds(properties?.context);
    delete properties?.context;

    this.loggerInstance.info(message, {
      projectName: this.projectName,
      componentName: this.componentName,
      ...properties,
      ...traceIds,
    });
  }

  log(message: string, properties?: Props): void {
    const traceIds = this.getTraceIds(properties?.context);
    delete properties?.context;

    this.loggerInstance.log(LOG_LEVELS.INFO, message, {
      projectName: this.projectName,
      componentName: this.componentName,
      ...properties,
      ...traceIds,
    });
  }

  warn(message: string, properties?: Props): void {
    const traceIds = this.getTraceIds(properties?.context);
    delete properties?.context;

    this.loggerInstance.log(LOG_LEVELS.WARNING, message, {
      projectName: this.projectName,
      componentName: this.componentName,
      ...properties,
      ...traceIds,
    });
  }

  event(name: string, message?: string, properties?: Props): void {
    const traceIds = this.getTraceIds(properties?.context);
    delete properties?.context;

    this.loggerInstance.log(LOG_LEVELS.EVENT, message || '', {
      projectName: this.projectName,
      componentName: this.componentName,
      name,
      ...properties,
      ...traceIds,
    });
  }

  dependency(name: string, data?: string, properties?: Props): void {
    const traceIds = this.getTraceIds(properties?.context);
    delete properties?.context;

    this.loggerInstance.log(LOG_LEVELS.DEPENDENCY, name || 'Dependency', {
      projectName: this.projectName,
      componentName: this.componentName,
      name,
      data,
      ...traceIds,
      ...properties,
    });
  }

  request(name: string, properties?: Props): void {
    const traceIds = this.getTraceIds(properties?.context);
    delete properties?.context;

    this.loggerInstance.log(LOG_LEVELS.REQUEST, name || 'Request', {
      projectName: this.projectName,
      componentName: this.componentName,
      name,
      ...traceIds,
      ...properties,
    });
  }

  private getTraceIds(context: Context): object {
    if (context) {
      return {
        operationId: getOperationId(context),
        sbOperationId: getServiceBusOperationId(context),
        sbParentId: getServiceBusParentId(context),
      };
    }

    return {};
  }

  private getWinstonTransports(): Transport[] {
    const transports: Transport[] = [];

    if (config.developmentMode) {
      const colors = {
        [LOG_LEVELS.CRITICAL]: 'red',
        [LOG_LEVELS.ERROR]: 'red',
        [LOG_LEVELS.WARNING]: 'yellow',
        [LOG_LEVELS.EVENT]: 'white',
        [LOG_LEVELS.REQUEST]: 'white',
        [LOG_LEVELS.DEPENDENCY]: 'white',
        [LOG_LEVELS.SECURITY]: 'white',
        [LOG_LEVELS.AUDIT]: 'white',
        [LOG_LEVELS.INFO]: 'blue',
        [LOG_LEVELS.DEBUG]: 'cyan',
      };
      const colorizer = winston.format.colorize();
      colorizer.addColors(colors);
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.splat(),
            winston.format.printf(({
              level, message, ...metadata
            }) => {
              const colorizedLevel = `[${colorizer.colorize(level, level)}]:`;
              let msg = `${colorizedLevel} ${message} `;
              if (metadata) {
                delete metadata.projectName;
                delete metadata.componentName;
                if (!config.console.disableMetadata) {
                  msg += stringify(metadata, null, config.console.disablePrettyPrint ? undefined : 2);
                }
              }
              return msg;
            }),
          ),
          level: config.logs.level,
        }),
      );

      if (config.files.enabled) {
        transports.push(
          new winston.transports.File({
            filename: `./logs/${getDateFilename()}.log`,
            level: config.logs.level,
            format: winston.format.printf((info) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const payload = { ...info } as any;
              delete payload.message;
              delete payload.projectName;
              delete payload.level;
              delete payload.componentName;
              return `{"level": "${info.level}", "message": "${info.message}", "payload": ${stringify(payload)}}`;
            }),
          }),
        );
      }
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
