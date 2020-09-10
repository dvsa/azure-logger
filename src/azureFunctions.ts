/* eslint-disable @typescript-eslint/no-explicit-any */
import { startOperation, wrapWithCorrelationContext, defaultClient } from 'applicationinsights';
import { AzureFunction, Context } from '@azure/functions';

/**
 * Wraps an Azure Function with correlation context to enable auto telemetry/log tracing.
 */
export const correlationContextWrapper = async (fn: AzureFunction, context: Context, ...args: any[]): Promise<void> => {
  const operation = context.executionContext.functionName;

  // Start an AI Correlation Context using the provided Function context
  // Need to use any as there's a mismatch in the az function/app insights types
  const correlationContext = startOperation(context as any, operation) || undefined;

  // Wrap the Function runtime with correlationContext
  return wrapWithCorrelationContext(async () => {
    // Run the Function
    await fn(context, ...args);
    defaultClient.flush();
  }, correlationContext)();
};
