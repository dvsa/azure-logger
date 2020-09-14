// Have to use any as the azure/appinsights interfaces are inconsistently typed
// Also the function invocation accepts args of any type
/* eslint-disable @typescript-eslint/no-explicit-any */
import { startOperation, wrapWithCorrelationContext, defaultClient } from 'applicationinsights';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';

/**
 * Wraps a non-HTTP trigger Azure Function with correlation context to enable auto telemetry/log tracing.
 * Uses the Function name as the operation name.
 *
 * @param fn non-HTTP trigger function e.g. timer/queue trigger
 * @param context function context
 * @param args any extra args to pass to the function invocation
 */
const nonHttpTriggerContextWrapper = async (fn: AzureFunction, context: Context, ...args: any[]): Promise<void> => {
  const operationName = context.executionContext?.functionName || '';
  const correlationContext = startOperation(context as any, operationName);

  return wrapWithCorrelationContext(async () => {
    await fn(context, ...args);
    defaultClient.flush();
  }, correlationContext || undefined)();
};

/**
 * Wraps an HTTP trigger Azure Function with correlation context to enable auto telemetry/log tracing.
 * Uses the HTTP request to generate the operation name.
 *
 * @param fn HTTP trigger function
 * @param context function context
 * @param req HTTP request object
 */
const httpTriggerContextWrapper = async (fn: AzureFunction, context: Context, req: HttpRequest): Promise<void> => {
  const correlationContext = startOperation(context as any, req as any);

  return wrapWithCorrelationContext(async () => {
    await fn(context, req);
    defaultClient.flush();
  }, correlationContext || undefined)();
};

export default {
  nonHttpTriggerContextWrapper,
  httpTriggerContextWrapper,
};
