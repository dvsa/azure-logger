import { getCorrelationContext, defaultClient } from 'applicationinsights';
import Logger from './logger';
import ILogger from './ILogger';
import getOperationId from './helpers/getOperationId';

export {
  Logger, ILogger, getCorrelationContext, defaultClient, getOperationId,
};
export * from './correlationWrappers';
