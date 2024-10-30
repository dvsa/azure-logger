import { HttpRequest, InvocationContext } from '@azure/functions';
import { startOperation, defaultClient, wrapWithCorrelationContext } from 'applicationinsights';
import { nonHttpTriggerContextWrapper, httpTriggerContextWrapper } from '../../src/correlationWrappers';

jest.mock('applicationinsights', () => ({
  startOperation: jest.fn(),
  // eslint-disable-next-line @typescript-eslint/ban-types
  wrapWithCorrelationContext: jest.fn((fn: Function) => fn),
  defaultClient: { flush: jest.fn() },
}));

describe('Correlation context wrappers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('nonHttpTriggerContextWrapper', () => {
    test('wraps an Azure function with correlation context and invokes the underlying function when called', async () => {
      const mockAzureFunction = jest.fn();
      const mockContext: any = {
        functionName: 'myAzureFunction',
        traceContext: {},
      };
      const mockExtraArg = Symbol('mockExtraArg');

      await nonHttpTriggerContextWrapper(mockAzureFunction, mockContext as InvocationContext, mockExtraArg);

      expect(startOperation).toHaveBeenCalledWith(mockContext, 'myAzureFunction');
      expect(wrapWithCorrelationContext).toHaveBeenCalled();
      expect(mockAzureFunction).toHaveBeenCalledWith(mockContext, mockExtraArg);
      expect(defaultClient.flush).toHaveBeenCalledWith();
    });

    test('passes empty operationName if function name is missing from context', async () => {
      const mockAzureFunction = jest.fn();
      const mockContext: any = {
        traceContext: {},
      };
      const mockExtraArg = Symbol('mockExtraArg');

      await nonHttpTriggerContextWrapper(mockAzureFunction, mockContext as InvocationContext, mockExtraArg);

      expect(startOperation).toHaveBeenCalledWith(mockContext, '');
      expect(wrapWithCorrelationContext).toHaveBeenCalled();
      expect(mockAzureFunction).toHaveBeenCalledWith(mockContext, mockExtraArg);
      expect(defaultClient.flush).toHaveBeenCalledWith();
    });
  });

  describe('httpTriggerContextWrapper', () => {
    test('wraps an Azure function with correlation context and invokes the underlying function when called', async () => {
      const mockAzureFunction = jest.fn();
      const mockContext: any = {};
      const mockReq: any = {};

      await httpTriggerContextWrapper(mockAzureFunction, mockContext as InvocationContext, mockReq as HttpRequest);

      expect(startOperation).toHaveBeenCalledWith(mockContext, mockReq);
      expect(wrapWithCorrelationContext).toHaveBeenCalled();
      expect(mockAzureFunction).toHaveBeenCalledWith(mockContext, mockReq);
      expect(defaultClient.flush).toHaveBeenCalledWith();
    });
  });
});
