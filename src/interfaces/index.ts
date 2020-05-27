/* eslint-disable @typescript-eslint/no-explicit-any */
import Transport from 'winston-transport';
import { LOG_LEVELS } from '../enums';

export interface ApplicationInsightsTransportOptions extends Transport.TransportStreamOptions {
  key: string;
  componentName: string;
  operationId: string;
}

export type LogInfo = ExceptionInfo | EventInfo | TraceInfo;

export interface ExceptionInfo {
  error: Error;
  level: LOG_LEVELS;
  message: string;
  projectName: string;
  componentName: string;
  meta: any;
  [key: string]: any;
}

export interface EventInfo {
  name: string;
  level: LOG_LEVELS;
  projectName: string;
  componentName: string;
  message: string;
  meta: any;
  [key: string]: any;
}

export interface TraceInfo {
  level: LOG_LEVELS;
  message: string;
  projectName: string;
  componentName: string;
  meta: any;
  [key: string]: any;
}
