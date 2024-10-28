import { InvocationContext } from '@azure/functions';
import { getServiceBusOperationId, getServiceBusParentId } from '../../../src/helpers/serviceBusHelper';

describe('Service Bus Helper', () => {
  describe('Get Operation Id', () => {
    test('get operation id from service bus properties', () => {
      const mockContext = {
        traceContext: {
          traceParent: 'testOpId',
        },
      };

      const result = getServiceBusOperationId(mockContext as InvocationContext);

      expect(result).toBe('testOpId');
    });

    test('no context returns undefined', () => {
      const result = getServiceBusOperationId(null as unknown as InvocationContext);

      expect(result).toBeUndefined();
    });

    test('no bindingData returns undefined', () => {
      const mockContext = {};

      const result = getServiceBusOperationId(mockContext as InvocationContext);

      expect(result).toBeUndefined();
    });

    test('no userProperties returns undefined', () => {
      const mockContext = { traceContext: {} };

      const result = getServiceBusOperationId(mockContext as InvocationContext);

      expect(result).toBeUndefined();
    });

    test('no operationId returns undefined', () => {
      const mockContext = {
        traceContext: {
          traceParent: null,
        },
      };

      const result = getServiceBusOperationId(mockContext as unknown as InvocationContext);

      expect(result).toBeUndefined();
    });
  });

  describe('Get Parent Id', () => {
    test('get parent id from service bus properties', () => {
      const mockContext = {
        traceContext: {
          traceParent: 'testParentId',
        },
      };

      const result = getServiceBusParentId(mockContext as InvocationContext);

      expect(result).toBe('testParentId');
    });

    test('no context returns undefined', () => {
      const result = getServiceBusParentId(null as unknown as InvocationContext);

      expect(result).toBeUndefined();
    });

    test('no bindingData returns undefined', () => {
      const mockContext = {};

      const result = getServiceBusParentId(mockContext as InvocationContext);

      expect(result).toBeUndefined();
    });

    test('no userProperties returns undefined', () => {
      const mockContext = { traceContext: {} };

      const result = getServiceBusParentId(mockContext as InvocationContext);

      expect(result).toBeUndefined();
    });

    test('no parentId returns undefined', () => {
      const mockContext = {
        traceContext: {
          traceParent: null,
        },
      };

      const result = getServiceBusParentId(mockContext as unknown as InvocationContext);

      expect(result).toBeUndefined();
    });
  });
});
