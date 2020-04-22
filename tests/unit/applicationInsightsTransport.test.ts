import { setup, TelemetryClient } from 'applicationinsights';
import ApplicationInsightsTransport from '../../src/applicationInsightsTransport';

jest.mock('applicationinsights', () => ({
  setup: jest.fn().mockReturnValue({ start: () => {} }),
  defaultClient: { context: 'Created by Mock' },
}));

describe('ApplicationInsightsTransport', () => {
  describe('constructor', () => {
    test('should use the client if one has been provided', () => {
      // Arrange + Act
      const result = new ApplicationInsightsTransport({ client: {} as TelemetryClient });

      // Assert
      expect(result.client).toEqual({});
      expect(setup).not.toHaveBeenCalled();
    });

    test('should get the client from the appInsights object if one has been provided', () => {
      // Arrange + Act
      const result = new ApplicationInsightsTransport({
        appInsights: { defaultClient: { context: 'appInsights' } },
      });

      // Assert
      expect(result.client).toEqual({ context: 'appInsights' });
      expect(setup).not.toHaveBeenCalled();
    });

    test('should create a new app insights client if one is not provided', () => {
      // Arrange + Act
      const result = new ApplicationInsightsTransport({});

      // Assert
      expect(result.client).toEqual({ context: 'Created by Mock' });
      expect(setup).toHaveBeenCalled();
    });
  });
});
