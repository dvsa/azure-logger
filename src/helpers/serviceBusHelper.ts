import { InvocationContext } from '@azure/functions';

function getServiceBusOperationId(context: InvocationContext): string | undefined { // needs investigation
  if (context && context.traceContext?.traceParent) {
    return context.traceContext?.traceParent;
  }
  return undefined;
}

function getServiceBusParentId(context: InvocationContext): string | undefined {
  if (context && context.traceContext?.traceParent) {
    return context.traceContext?.traceParent;
  }
  return undefined;
}

export {
  getServiceBusOperationId,
  getServiceBusParentId,
};
