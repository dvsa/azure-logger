// eslint-disable-next-line import/no-unresolved
import { Context } from '@azure/functions';

import getOperationId from '../../../src/helpers/getOperationId';

describe('getOperationId', () => {
  test('should return an empty string if there is no traceContext', () => {
    expect(getOperationId({} as Context)).toEqual('');
  });

  test('should return an empty string if ther is no traceParent', () => {
    expect(getOperationId({ traceContext: {} } as Context)).toEqual('');
  });

  test('should return a trace id if a traceParent exists', () => {
    expect(getOperationId({
      traceContext:
      {
        traceparent: '00-763230142f4317478bf6bdcee3886ef0-2839ff750bf4cc46-00',
      },
    } as Context)).toEqual('763230142f4317478bf6bdcee3886ef0');
  });
});
