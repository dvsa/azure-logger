import * as applicationInsights from 'applicationinsights';
import {
  Contracts,
  DistributedTracingModes,
  KnownSeverityLevel,
  TelemetryClient,
} from 'applicationinsights';
import {
  DefaultAzureCredential,
  type TokenCredential,
} from '@azure/identity';
import Transport from 'winston-transport';

import {
  ApplicationInsightsTransportOptions,
  DependencyInfo,
  EventInfo,
  ExceptionInfo,
  LogInfo,
  PageViewInfo,
  RequestInfo,
  TraceInfo,
} from './interfaces';
import { APP_INSIGHTS_LOG_LEVELS, LOG_LEVELS } from './enums';
import { dropAADLogsTelemetryProcessor } from './dropAADLogsTelemetryProcessor';

class ApplicationInsightsTransport extends Transport {
  client: TelemetryClient;

  private static resolveConnectionString(
    connectionString?: string,
  ): string {
    const trimmedConnectionString = connectionString?.trim();

    if (!trimmedConnectionString) {
      throw new Error(
        'APPLICATIONINSIGHTS_CONNECTION_STRING is required to identify the Application Insights resource',
      );
    }

    return trimmedConnectionString;
  }

  private static resolveCredential(
    authenticationString?: string,
  ): TokenCredential | undefined {
    const trimmedAuthenticationString = authenticationString?.trim();

    if (!trimmedAuthenticationString) {
      return undefined;
    }

    const authenticationProperties = new Map<string, string>();

    for (const entry of trimmedAuthenticationString.split(';')) {
      const trimmedEntry = entry.trim();

      if (!trimmedEntry) {
        continue;
      }

      const separatorIndex = trimmedEntry.indexOf('=');

      if (separatorIndex === -1) {
        throw new Error(
          `Invalid Application Insights authentication setting: "${trimmedEntry}"`,
        );
      }

      const key = trimmedEntry
        .slice(0, separatorIndex)
        .trim()
        .toLowerCase();

      const value = trimmedEntry
        .slice(separatorIndex + 1)
        .trim();

      authenticationProperties.set(key, value);
    }

    const authorization =
      authenticationProperties.get('authorization');

    if (authorization?.toLowerCase() !== 'aad') {
      throw new Error(
        'Unsupported Application Insights authentication configuration. Expected Authorization=AAD',
      );
    }

    const managedIdentityClientId =
      authenticationProperties.get('clientid');

    return new DefaultAzureCredential({
      managedIdentityClientId:
        managedIdentityClientId || undefined,
    });
  }

  logLevelsMap = {
    [LOG_LEVELS.AUDIT]: APP_INSIGHTS_LOG_LEVELS.TRACE,
    [LOG_LEVELS.CRITICAL]: APP_INSIGHTS_LOG_LEVELS.TRACE,
    [LOG_LEVELS.DEBUG]: APP_INSIGHTS_LOG_LEVELS.TRACE,
    [LOG_LEVELS.ERROR]: APP_INSIGHTS_LOG_LEVELS.EXCEPTION,
    [LOG_LEVELS.EVENT]: APP_INSIGHTS_LOG_LEVELS.EVENT,
    [LOG_LEVELS.INFO]: APP_INSIGHTS_LOG_LEVELS.TRACE,
    [LOG_LEVELS.SECURITY]: APP_INSIGHTS_LOG_LEVELS.TRACE,
    [LOG_LEVELS.WARNING]: APP_INSIGHTS_LOG_LEVELS.TRACE,
    [LOG_LEVELS.DEPENDENCY]: APP_INSIGHTS_LOG_LEVELS.DEPENDENCY,
    [LOG_LEVELS.REQUEST]: APP_INSIGHTS_LOG_LEVELS.REQUEST,
    [LOG_LEVELS.PAGE_VIEW]: APP_INSIGHTS_LOG_LEVELS.PAGE_VIEW,
  };

  severityLevelMap = {
    [LOG_LEVELS.AUDIT]: KnownSeverityLevel.Verbose,
    [LOG_LEVELS.CRITICAL]: KnownSeverityLevel.Critical,
    [LOG_LEVELS.DEBUG]: KnownSeverityLevel.Verbose,
    [LOG_LEVELS.ERROR]: KnownSeverityLevel.Error,
    [LOG_LEVELS.EVENT]: KnownSeverityLevel.Information,
    [LOG_LEVELS.INFO]: KnownSeverityLevel.Information,
    [LOG_LEVELS.SECURITY]: KnownSeverityLevel.Information,
    [LOG_LEVELS.WARNING]: KnownSeverityLevel.Warning,
    [LOG_LEVELS.DEPENDENCY]: KnownSeverityLevel.Information,
    [LOG_LEVELS.REQUEST]: KnownSeverityLevel.Information,
    [LOG_LEVELS.PAGE_VIEW]: KnownSeverityLevel.Information,
  };

  constructor(options: ApplicationInsightsTransportOptions) {
    super(options);

    const connectionString =
      ApplicationInsightsTransport.resolveConnectionString(
        options.connectionString,
      );

    const credential =
      ApplicationInsightsTransport.resolveCredential(
        options.authenticationString,
      );

    applicationInsights
      .setup(connectionString)
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true, true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(true, true)
      .setUseDiskRetryCaching(true)
      .setSendLiveMetrics(false)
      .setDistributedTracingMode(
        DistributedTracingModes.AI_AND_W3C,
      );

    if (credential) {
      (applicationInsights.defaultClient.config as any).aadTokenCredential = credential;
    }

    applicationInsights.start();

    this.client = applicationInsights.defaultClient;

    this.client.context.tags[
      this.client.context.keys.cloudRole
    ] = options.componentName;

    this.client.context.tags['X-Azure-Ref'] = '';
    this.client.context.tags['INCAP-REQ-ID'] = '';
    this.client.context.tags['Incap-Ses'] = '';

    this.client.addTelemetryProcessor(
      dropAADLogsTelemetryProcessor,
    );

    this.sendStartupTelemetry(
      Boolean(credential),
      options.componentName,
    );
  }

  private createTrace(info: TraceInfo): void {
    const {
      message, meta, operationId, ...otherProperties
    } = info;

    this.client.trackTrace({
      severity: this.severityLevelMap[info.level],
      message: info.message,
      properties: {
        ...otherProperties,
        operationId: info.sbOperationId || info.operationId,
        sessionId: info.sessionId,
        userId: info.userId,
        userAuthUserId: info.userAuthUserId,
        userAccountId: info.userAccountId,
      },
    });
  }

  private createException(info: ExceptionInfo): void {
    const {
      error, message, level, meta, operationId, ...otherProperties
    } = info;

    const exception: Contracts.ExceptionTelemetry = {
      severity: KnownSeverityLevel.Error,
      exception: error,
      properties: {
        ...otherProperties,
        operationId: info.sbOperationId || info.operationId,
        sessionId: info.sessionId,
        userId: info.userId,
        userAuthUserId: info.userAuthUserId,
        userAccountId: info.userAccountId,
      },
    };

    if (exception.properties && message.trim().length > 0) {
      exception.properties.message = message;
    }

    this.client.trackException(exception);
  }

  private createEvent(info: EventInfo): void {
    const {
      name, message, meta, level, operationId, ...otherProperties
    } = info;

    const event: Contracts.EventTelemetry = {
      name,
      properties: {
        ...otherProperties,
        operationId: info.sbOperationId || info.operationId,
        sessionId: info.sessionId,
        userId: info.userId,
        userAuthUserId: info.userAuthUserId,
        userAccountId: info.userAccountId,
      },
    };

    if (event.properties && message.trim().length > 0) {
      event.properties.message = message;
    }

    this.client.trackEvent(event);
  }

  private createDependency(info: DependencyInfo): void {
    const dependency: Contracts.DependencyTelemetry = {
      ...info,
      duration: info.duration,
      success: info.success,
      resultCode: String(info.resultCode),
      dependencyTypeName: info.dependencyTypeName,
      name: info.name,
      data: info.data,
      properties: {
        ...info,
        operationId: info.sbOperationId || info.operationId,
        sessionId: info.sessionId,
        userId: info.userId,
        userAuthUserId: info.userAuthUserId,
        userAccountId: info.userAccountId,
      },
    };

    this.client.trackDependency(dependency as any);
  }

  private createRequest(info: RequestInfo): void {
    const request: Contracts.RequestTelemetry = {
      ...info,
      duration: info.duration,
      success: info.success,
      resultCode: info.resultCode,
      name: info.name,
      url: info.url,
      properties: {
        ...info,
        operationId: info.sbOperationId || info.operationId,
        sessionId: info.sessionId,
        userId: info.userId,
        userAuthUserId: info.userAuthUserId,
        userAccountId: info.userAccountId,
      },
    };

    this.client.trackRequest(request as any);
  }

  private createPageView(info: PageViewInfo): void {
    const pageView: Contracts.PageViewTelemetry = {
      id: info.name,
      name: info.name,
      duration: 0,
      properties: {
        ...info,
        operationId: info.sbOperationId || info.operationId,
        sessionId: info.sessionId,
        userId: info.userId,
        userAuthUserId: info.userAuthUserId,
        userAccountId: info.userAccountId,
      },
    };

    this.client.trackPageView(pageView as any);
  }

  private sendStartupTelemetry(
    usingMicrosoftEntra: boolean,
    componentName: string,
  ): void {
    const authenticationMode = usingMicrosoftEntra
      ? 'MicrosoftEntra'
      : 'ConnectionStringOnly';

    this.client.trackTrace({
      message: usingMicrosoftEntra
        ? 'Application Insights configured using Microsoft Entra authentication'
        : 'Application Insights configured using connection string authentication',
      severity: KnownSeverityLevel.Information,
      properties: {
        componentName,
        authenticationMode,
        source: '@dvsa/azure-logger',
        startup: 'true',
        operationName: `${componentName} startup`,
      },
    });
  }
}

export default ApplicationInsightsTransport;
