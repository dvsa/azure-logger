/* eslint-disable @typescript-eslint/unbound-method */
import { setup, TelemetryClient } from 'applicationinsights';
import {
  TraceTelemetry,
  SeverityLevel,
  EventTelemetry,
  ExceptionTelemetry,
} from 'applicationinsights/out/Declarations/Contracts';
import ApplicationInsightsTransport from '../../src/applicationInsightsTransport';
import { LogInfo } from '../../src/interfaces';
import { LOG_LEVELS } from '../../src/enums';

jest.mock('applicationinsights', () => ({
  setup: jest.fn().mockReturnValue({ start: () => {} }),
  defaultClient: {
    context: 'Created by Mock',
    trackTrace: jest.fn(),
    trackException: jest.fn(),
    trackEvent: jest.fn(),
  },
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
      expect(result.client.context).toEqual('Created by Mock');
      expect(setup).toHaveBeenCalled();
    });
  });
  describe('log', () => {
    const projectName = 'DVSA';
    const componentName = 'azure-logger';
    const message = 'mock-message';
    const eventName = 'mock-event-name';

    const expectedTraceInput: TraceTelemetry = {
      severity: SeverityLevel.Information,
      message,
      properties: {
        projectName,
        componentName,
      },
    };
    const expectedEventInput: EventTelemetry = {
      name: eventName,
      properties: {
        projectName,
        componentName,
        message,
      },
    };
    const expectedErrorInput: ExceptionTelemetry = {
      exception: new Error(message),
      severity: SeverityLevel.Error,
      properties: {
        projectName,
        componentName,
      },
    };

    let applicationinsightsTransport: ApplicationInsightsTransport;

    beforeEach(() => {
      applicationinsightsTransport = new ApplicationInsightsTransport({});
    });

    test('should create a trace log when provided with a audit log', () => {
      // Arrange
      const mockLogInfo: LogInfo = {
        projectName,
        componentName,
        message,
        level: LOG_LEVELS.AUDIT,
      };
      // Act
      applicationinsightsTransport.log(mockLogInfo, () => {});
      // Assert
      expect(applicationinsightsTransport.client.trackTrace).toHaveBeenLastCalledWith(expectedTraceInput);
    });

    test('should create a trace log when provided with a critical log', () => {
      // Arrange
      const mockLogInfo: LogInfo = {
        projectName,
        componentName,
        message,
        level: LOG_LEVELS.CRITICAL,
      };
      // Act
      applicationinsightsTransport.log(mockLogInfo, () => {});
      // Assert
      expect(applicationinsightsTransport.client.trackTrace).toHaveBeenLastCalledWith(expectedTraceInput);
    });

    test('should create a trace log when provided with a debug log', () => {
      // Arrange
      const mockLogInfo: LogInfo = {
        projectName,
        componentName,
        message,
        level: LOG_LEVELS.DEBUG,
      };
      // Act
      applicationinsightsTransport.log(mockLogInfo, () => {});
      // Assert
      expect(applicationinsightsTransport.client.trackTrace).toHaveBeenLastCalledWith(expectedTraceInput);
    });

    test('should create a exception log when provided with a error log', () => {
      // Arrange
      const mockLogInfo: LogInfo = {
        projectName,
        componentName,
        message,
        level: LOG_LEVELS.ERROR,
      };
      // Act
      applicationinsightsTransport.log(mockLogInfo, () => {});
      // Assert
      expect(applicationinsightsTransport.client.trackException).toHaveBeenLastCalledWith(expectedErrorInput);
    });

    test('should create a event log when provided with a event log', () => {
      // Arrange
      const mockLogInfo: LogInfo = {
        projectName,
        componentName,
        message,
        level: LOG_LEVELS.EVENT,
        name: eventName,
      };
      // Act
      applicationinsightsTransport.log(mockLogInfo, () => {});
      // Assert
      expect(applicationinsightsTransport.client.trackEvent).toHaveBeenLastCalledWith(expectedEventInput);
    });

    test('should create a trace log when provided with a info log', () => {
      // Arrange
      const mockLogInfo: LogInfo = {
        projectName,
        componentName,
        message,
        level: LOG_LEVELS.INFO,
      };
      // Act
      applicationinsightsTransport.log(mockLogInfo, () => {});
      // Assert
      expect(applicationinsightsTransport.client.trackTrace).toHaveBeenLastCalledWith(expectedTraceInput);
    });

    test('should create a trace log when provided with a security log', () => {
      // Arrange
      const mockLogInfo: LogInfo = {
        projectName,
        componentName,
        message,
        level: LOG_LEVELS.SECURITY,
      };
      // Act
      applicationinsightsTransport.log(mockLogInfo, () => {});
      // Assert
      expect(applicationinsightsTransport.client.trackTrace).toHaveBeenLastCalledWith(expectedTraceInput);
    });

    test('should create a trace log when provided with a warning log', () => {
      // Arrange
      const mockLogInfo: LogInfo = {
        projectName,
        componentName,
        message,
        level: LOG_LEVELS.WARNING,
      };
      // Act
      applicationinsightsTransport.log(mockLogInfo, () => {});
      // Assert
      expect(applicationinsightsTransport.client.trackTrace).toHaveBeenLastCalledWith(expectedTraceInput);
    });
  });
});
