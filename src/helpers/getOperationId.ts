import { InvocationContext } from '@azure/functions';
import crypto from 'crypto';

function getOperationId(context: InvocationContext): string {
  if (!context.traceContext || !context.traceContext.traceParent) {
    return crypto.randomBytes(64).toString('hex').substring(0, 31);
  }
  return context.traceContext.traceParent;
}

export default getOperationId;
