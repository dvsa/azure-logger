/* eslint-disable @typescript-eslint/no-explicit-any */
import { TelemetryClient } from 'applicationinsights';
import Transport from 'winston-transport';
import { LOG_LEVELS } from '../enums';

export interface ApplicationInsightsTransportOptions extends Transport.TransportStreamOptions {
  key?: string;
  client?: TelemetryClient;
  appInsights?: any;
}

export interface LogInfo {
  level: LOG_LEVELS;
  message: string;
  projectName: string;
  componentName: string;
  name?: string;
}
