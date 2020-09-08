import { startOperation, wrapWithCorrelationContext, defaultClient } from 'applicationinsights';
import getOperationId from './helpers/getOperationId';

export default {
  startOperation,
  wrapWithCorrelationContext,
  defaultClient,
  getOperationId,
};
