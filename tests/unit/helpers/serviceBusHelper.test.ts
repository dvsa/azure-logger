import { getServiceBusOperationId, getServiceBusParentId } from '../../../src/helpers/serviceBusHelper';

describe('Service Bus Helper', () => {
  describe('Get Operation Id', () => {
    test('get operation id from service bus properties', () => {
      const mockContext = {
        bindingData: {
          userProperties: {
            operationId: 'testOpId',
          },
        },
      };

      const result = getServiceBusOperationId(mockContext as any);

      expect(result).toStrictEqual('testOpId');
    });

    test('no context returns undefined', () => {
      const result = getServiceBusOperationId(null as any);

      expect(result).toStrictEqual(undefined);
    });

    test('no bindingData returns undefined', () => {
      const mockContext = {};

      const result = getServiceBusOperationId(mockContext as any);

      expect(result).toStrictEqual(undefined);
    });

    test('no userProperties returns undefined', () => {
      const mockContext = { bindingData: {} };

      const result = getServiceBusOperationId(mockContext as any);

      expect(result).toStrictEqual(undefined);
    });

    test('no operationId returns undefined', () => {
      const mockContext = {
        bindingData: {
          userProperties: {
            operationId: null,
          },
        },
      };

      const result = getServiceBusOperationId(mockContext as any);

      expect(result).toStrictEqual(undefined);
    });
  });

  describe('Get Parent Id', () => {
    test('get parent id from service bus properties', () => {
      const mockContext = {
        bindingData: {
          userProperties: {
            parentId: 'testParentId',
          },
        },
      };

      const result = getServiceBusParentId(mockContext as any);

      expect(result).toStrictEqual('testParentId');
    });

    test('no context returns undefined', () => {
      const result = getServiceBusParentId(null as any);

      expect(result).toStrictEqual(undefined);
    });

    test('no bindingData returns undefined', () => {
      const mockContext = {};

      const result = getServiceBusParentId(mockContext as any);

      expect(result).toStrictEqual(undefined);
    });

    test('no userProperties returns undefined', () => {
      const mockContext = { bindingData: {} };

      const result = getServiceBusParentId(mockContext as any);

      expect(result).toStrictEqual(undefined);
    });

    test('no parentId returns undefined', () => {
      const mockContext = {
        bindingData: {
          userProperties: {
            parentId: null,
          },
        },
      };

      const result = getServiceBusParentId(mockContext as any);

      expect(result).toStrictEqual(undefined);
    });
  });
});
