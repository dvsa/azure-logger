/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  setup,
  defaultClient,
  TelemetryClient,
  DistributedTracingModes,
} from 'applicationinsights';
import { SeverityLevel, EventTelemetry, ExceptionTelemetry } from 'applicationinsights/out/Declarations/Contracts';
import Transport from 'winston-transport';

import {
  ApplicationInsightsTransportOptions,
  LogInfo,
  EventInfo,
  TraceInfo,
  ExceptionInfo,
} from './interfaces';
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

  severityLevelMap = {
    [LOG_LEVELS.AUDIT]: SeverityLevel.Verbose,
    [LOG_LEVELS.CRITICAL]: SeverityLevel.Critical,
    [LOG_LEVELS.DEBUG]: SeverityLevel.Verbose,
    [LOG_LEVELS.ERROR]: SeverityLevel.Error,
    [LOG_LEVELS.EVENT]: SeverityLevel.Information,
    [LOG_LEVELS.INFO]: SeverityLevel.Information,
    [LOG_LEVELS.SECURITY]: SeverityLevel.Information,
    [LOG_LEVELS.WARNING]: SeverityLevel.Warning,
  };

  constructor(options: ApplicationInsightsTransportOptions) {
    super(options);
    setup(options.key)
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true, true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(true, true)
      .setUseDiskRetryCaching(true)
      .setSendLiveMetrics(false)
      .setDistributedTracingMode(DistributedTracingModes.AI_AND_W3C)
      .start();
    this.client = defaultClient;
  }

  log(info: LogInfo, callback: Function): void {
    switch (this.logLevelsMap[info.level]) {
      case APP_INSIGHTS_LOG_LEVELS.EVENT:
        this.createEvent(info as EventInfo);
        break;
      case APP_INSIGHTS_LOG_LEVELS.EXCEPTION:
        this.createException(info as ExceptionInfo);
        break;
      case APP_INSIGHTS_LOG_LEVELS.TRACE:
      default:
        this.createTrace(info as TraceInfo);
        break;
    }
    callback();
  }

  private createTrace(info: TraceInfo): void {
    const { message, meta, ...otherProperties } = info;
    this.client.trackTrace({
      severity: this.severityLevelMap[info.level],
      message: info.message,
      properties: {
        ...otherProperties,
      },
    });
  }

  private createException(info: ExceptionInfo): void {
    const {
      error,
      message,
      level,
      meta,
      ...otherProperties
    } = info;

    const exception: ExceptionTelemetry = {
      severity: SeverityLevel.Error,
      exception: error,
      properties: {
        ...otherProperties,
      },
    };

    if (exception.properties && message.trim().length > 0) {
      exception.properties.message = message;
    }

    this.client.trackException(exception);
  }

  private createEvent(info: EventInfo): void {
    const {
      name,
      message,
      meta,
      level,
      ...otherProperties
    } = info;

    const event: EventTelemetry = {
      name,
      properties: {
        ...otherProperties,
      },
    };

    if (event.properties && message.trim().length > 0) {
      event.properties.message = message;
    }

    this.client.trackEvent(event);
  }
}

export default ApplicationInsightsTransport;
