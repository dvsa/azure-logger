import { InvocationContext } from '@azure/functions';
import crypto from 'crypto';
import getOperationId from '../../../src/helpers/getOperationId';

/*
  If there isn't a traceparent passed into Traceparent, the function Util.w3cTraceId
  is used to generate a new operation id
*/
crypto.randomBytes = jest.fn().mockReturnValue('new-trace-id');

describe('getOperationId', () => {
  test('should return a new operation id if there is no traceContext', () => {
    expect(getOperationId({} as InvocationContext)).toBe('new-trace-id');
  });

  test('should return a new operation id if there is no traceParent', () => {
    expect(getOperationId({ traceContext: {} } as InvocationContext)).toBe('new-trace-id');
  });

  test('should return a trace id if a traceParent exists', () => {
    expect(getOperationId({
      traceContext:
      {
        traceParent: '763230142f4317478bf6bdcee3886ef0',
      },
    } as InvocationContext)).toBe('763230142f4317478bf6bdcee3886ef0');
  });
});
