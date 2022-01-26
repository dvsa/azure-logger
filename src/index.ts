import { getCorrelationContext, startOperation, defaultClient } from 'applicationinsights';
import Logger from './logger';
import ILogger from './ILogger';
import getOperationId from './helpers/getOperationId';

export { Logger, ILogger, getOperationId, getCorrelationContext, startOperation, defaultClient };
export * from './correlationWrappers';
