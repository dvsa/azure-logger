// eslint-disable-next-line import/no-unresolved
import { Context } from '@azure/functions';
import Traceparent from 'applicationinsights/out/Library/Traceparent';

function getOperationId(context: Context): string {
  if (!context.traceContext || !context.traceContext.traceparent) {
    return '';
  }
  return new Traceparent(context.traceContext.traceparent).traceId;
}

export default getOperationId;
