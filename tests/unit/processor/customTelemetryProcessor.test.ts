import { EnvelopeTelemetry } from 'applicationinsights/out/Declarations/Contracts';
import { customTelemetryProcessor } from '../../../src/processor/customTelemetryProcessor';

describe('custom telemetry processor', () => {
  test('removes keys from remote dependency', () => {
    const envelope = {
      data: {
        baseType: 'RemoteDependencyData',
        baseData: {
          success: true,
          name: 'GET /api/address=london,%20UK&key=apikeyhere&region=uk',
          data: 'http://localhost:7002/api/?address=london,%20UK&key=apikeyhere&region=uk',
          type: 'Http',
        },
      },
    };

    const result = customTelemetryProcessor(envelope as any as EnvelopeTelemetry);

    expect(result).toBe(true);
    expect(envelope).toStrictEqual({
      data: {
        baseType: 'RemoteDependencyData',
        baseData: {
          success: true,
          name: '/api/?address=london%2C+UK&key=*********here&region=uk', // TODO method is missing here
          data: 'http://localhost:7002/api/?address=london%2C+UK&key=*********here&region=uk',
          type: 'Http',
        },
      },
    });
  });
});
