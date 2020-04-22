/* eslint-disable @typescript-eslint/no-explicit-any */
import { TelemetryClient } from 'applicationinsights';
import Transport from 'winston-transport';

export interface ApplicationInsightsTransportOptions extends Transport.TransportStreamOptions {
  key?: string;
  client?: TelemetryClient;
  appInsights?: any;
}
