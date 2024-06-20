import { EnvelopeTelemetry } from 'applicationinsights/out/Declarations/Contracts';
import { dropAADLogsTelemetryProcessor } from '../../src/dropAADLogsTelemetryProcessor';

jest.mock('applicationinsights', () => ({
  setup: jest.fn().mockReturnValue({
    start: () => { },
    setAutoDependencyCorrelation: jest.fn().mockReturnThis(),
    setAutoCollectRequests: jest.fn().mockReturnThis(),
    setAutoCollectPerformance: jest.fn().mockReturnThis(),
    setAutoCollectExceptions: jest.fn().mockReturnThis(),
    setAutoCollectDependencies: jest.fn().mockReturnThis(),
    setAutoCollectConsole: jest.fn().mockReturnThis(),
    setUseDiskRetryCaching: jest.fn().mockReturnThis(),
    setSendLiveMetrics: jest.fn().mockReturnThis(),
    setDistributedTracingMode: jest.fn().mockReturnThis(),
  }),
  defaultClient: {
    addTelemetryProcessor: jest.fn(),
  },
}));

test.each`
success | type | telemetryTypeText | successText | expectedResult
${true} | ${'InProc | Microsoft.AAD'} | ${'AAD'} | ${'successful'} | ${false}
${false} | ${'InProc | Microsoft.AAD'} | ${'AAD'} | ${'unsuccessful'} | ${true}
${true} | ${'fakeType'} | ${'non-AAD'} | ${'successful'} | ${true}
${false} | ${'fakeType'} | ${'non-AAD'} | ${'unsuccessful'} | ${true}
`('When $successText $telemetryTypeText is processed, should return $expectedResult', ({ success, type, expectedResult }) => {
  const envelope = {
    data: {
      baseData: {
        type,
        success,
      },
    },
  } as unknown as EnvelopeTelemetry;

  expect(dropAADLogsTelemetryProcessor(envelope)).toBe(expectedResult);
});

test('When successful AAD telemetry is processed, should return false', () => {
  const envelope = {
    data: {
      baseData: {
        type: 'InProc | Microsoft.AAD',
        success: true,
      },
    },
  } as unknown as EnvelopeTelemetry;

  expect(dropAADLogsTelemetryProcessor(envelope)).toBe(false);
});
