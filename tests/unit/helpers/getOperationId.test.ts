// eslint-disable-next-line import/no-unresolved
import { Context } from '@azure/functions';
import Util from 'applicationinsights/out/Library/Util';
import getOperationId from '../../../src/helpers/getOperationId';

/*
  If there isn't a traceparent passed into Traceparent, the function Util.w3cTraceId
  is used to generate a new operation id
*/
Util.w3cTraceId = jest.fn().mockReturnValue('new-trace-id');

describe('getOperationId', () => {
  test('should return an new operation id if there is no traceContext', () => {
    expect(getOperationId({} as Context)).toEqual('new-trace-id');
  });

  test('should return an empty string if ther is no traceParent', () => {
    expect(getOperationId({ traceContext: {} } as Context)).toEqual('new-trace-id');
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
