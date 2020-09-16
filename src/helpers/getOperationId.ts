import { Context } from '@azure/functions';
import Traceparent from 'applicationinsights/out/Library/Traceparent';

function getOperationId(context: Context): string {
  if (!context.traceContext || !context.traceContext.traceparent) {
    return new Traceparent(undefined).traceId;
  }
  return new Traceparent(context.traceContext.traceparent).traceId;
}

export default getOperationId;
