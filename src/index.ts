import { getCorrelationContext, defaultClient } from 'applicationinsights';
import Logger from './logger';
import ILogger from './ILogger';

export {
  Logger, ILogger, getCorrelationContext, defaultClient,
};
export * from './correlationWrappers';
