/* eslint-disable @typescript-eslint/no-explicit-any */
import { setup, defaultClient, TelemetryClient } from 'applicationinsights';
import { SeverityLevel } from 'applicationinsights/out/Declarations/Contracts';
import Transport from 'winston-transport';

import { ApplicationInsightsTransportOptions, LogInfo } from './interfaces';
import { LOG_LEVELS, APP_INSIGHTS_LOG_LEVELS } from './enums';

class ApplicationInsightsTransport extends Transport {
  client: TelemetryClient;

  logLevelsMap = {
    [LOG_LEVELS.AUDIT]: APP_INSIGHTS_LOG_LEVELS.TRACE,
    [LOG_LEVELS.CRITICAL]: APP_INSIGHTS_LOG_LEVELS.TRACE,
    [LOG_LEVELS.DEBUG]: APP_INSIGHTS_LOG_LEVELS.TRACE,
    [LOG_LEVELS.ERROR]: APP_INSIGHTS_LOG_LEVELS.EXCEPTION,
    [LOG_LEVELS.EVENT]: APP_INSIGHTS_LOG_LEVELS.EVENT,
    [LOG_LEVELS.INFO]: APP_INSIGHTS_LOG_LEVELS.TRACE,
    [LOG_LEVELS.SECURITY]: APP_INSIGHTS_LOG_LEVELS.TRACE,
    [LOG_LEVELS.WARNING]: APP_INSIGHTS_LOG_LEVELS.TRACE,
  };

  constructor(options: ApplicationInsightsTransportOptions) {
    super(options);
    if (options.client) {
      this.client = options.client;
    } else if (options.appInsights) {
      this.client = options.appInsights.defaultClient;
    } else {
      setup(options.key).start();
      this.client = defaultClient;
    }
  }

  // TODO - switch the Log Info Type and create seperate ones for each type
  log(info: LogInfo, callback: Function): void {
    switch (this.logLevelsMap[info.level]) {
      case APP_INSIGHTS_LOG_LEVELS.EVENT:
        this.createEvent(info);
        break;
      case APP_INSIGHTS_LOG_LEVELS.EXCEPTION:
        this.createException(info);
        break;
      case APP_INSIGHTS_LOG_LEVELS.TRACE:
      default:
        this.createTrace(info);
        break;
    }
    callback();
  }

  private createTrace(info: LogInfo): void {
    this.client.trackTrace({
      severity: SeverityLevel.Information,
      message: info.message,
      properties: {
        projectName: info.projectName,
        componentName: info.componentName,
      },
    });
  }

  private createException(info: LogInfo): void {
    this.client.trackException({
      severity: SeverityLevel.Error,
      exception: new Error(info.message),
      properties: {
        projectName: info.projectName,
        componentName: info.componentName,
      },
    });
  }

  private createEvent(info: LogInfo): void {
    this.client.trackEvent({
      name: info.name || '',
      properties: {
        projectName: info.projectName,
        componentName: info.componentName,
        message: info.message,
      },
    });
  }
}

export default ApplicationInsightsTransport;
