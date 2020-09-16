import Logger from './logger';
import ILogger from './ILogger';
import { nonHttpTriggerContextWrapper, httpTriggerContextWrapper } from './correlationWrappers';
import getOperationId from './helpers/getOperationId';

const correlationUtils = {
  nonHttpTriggerContextWrapper,
  httpTriggerContextWrapper,
  getOperationId,
};

export {
  Logger, ILogger, correlationUtils,
};
