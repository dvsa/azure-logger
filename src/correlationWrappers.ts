/* eslint-disable @typescript-eslint/ban-types,@typescript-eslint/await-thenable */
// Have to use any as the azure/appinsights interfaces are inconsistently typed
// Also the function invocation accepts args of any type
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  startOperation, wrapWithCorrelationContext, defaultClient, azureFunctionsTypes,
} from 'applicationinsights';
import { InvocationContext, HttpRequest, HttpResponseInit } from '@azure/functions';

/**
 * Wraps a non-HTTP trigger Azure Function with correlation context to enable auto telemetry/log tracing.
 * Uses the Function name as the operation name.
 *
 * @param fn non-HTTP trigger function e.g. timer/queue trigger
 * @param context function context
 * @param args any extra args to pass to the function invocation
 */
export const nonHttpTriggerContextWrapper = async (fn: Function, context: InvocationContext, ...args: unknown[]): Promise<HttpResponseInit> => {
  const operationName = context.functionName || '';
  const correlationContext = startOperation(context as azureFunctionsTypes.Context, operationName);

  return wrapWithCorrelationContext(async () => {
    const result = await fn(context, ...args) as HttpResponseInit;
    if (defaultClient) {
      await defaultClient.flush();
    }
    return result;
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
export const httpTriggerContextWrapper = async (fn: Function, context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const correlationContext = startOperation(context as azureFunctionsTypes.Context, req as any);

  return wrapWithCorrelationContext(async () => {
    const result = await fn(context, req) as HttpResponseInit;
    if (defaultClient) {
      await defaultClient.flush();
    }
    return result;
  }, correlationContext || undefined)();
};
