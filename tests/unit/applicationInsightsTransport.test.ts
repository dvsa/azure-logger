/* eslint-disable @typescript-eslint/unbound-method */
import { setup } from 'applicationinsights';
import {
  TraceTelemetry,
  SeverityLevel,
  EventTelemetry,
  ExceptionTelemetry,
} from 'applicationinsights/out/Declarations/Contracts';
import ApplicationInsightsTransport from '../../src/applicationInsightsTransport';
import { ExceptionInfo, EventInfo, TraceInfo } from '../../src/interfaces';
import { LOG_LEVELS } from '../../src/enums';

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
    context: {
      keys: {
        cloudRole: 'cloudRole',
        operationId: 'operationId',
        operationParentId: 'operationParentId',
      },
      tags: {
        cloudRole: '',
        operationId: '',
        operationParentId: '',
      },
    },
    trackTrace: jest.fn(),
    trackException: jest.fn(),
    trackEvent: jest.fn(),
  },
  DistributedTracingModes: {
    AI_AND_W3C: 1,
  },
}));


describe('ApplicationInsightsTransport', () => {
  describe('constructor', () => {
    test('should create a new app insights client', () => {
      // Arrange
      const key = 'dummy-key';
      const componentName = 'azure-logger';
      const parentOperationId = 'parent-operation-id';
      const operationId = 'operation-id';
      // Act
      const result = new ApplicationInsightsTransport({
        key, componentName, parentOperationId, operationId,
      });

      // Assert
      expect(setup).toHaveBeenCalledWith(key);
      expect(result.client.context.tags.cloudRole).toEqual(componentName);
      expect(result.client.context.tags.operationParentId).toEqual(parentOperationId);
      expect(result.client.context.tags.operationId).toEqual(operationId);
    });
  });

  describe('log', () => {
    const key = 'dummy-key';
    const projectName = 'DVSA';
    const componentName = 'azure-logger';
    const message = 'mock-message';
    const eventName = 'mock-event-name';
    const parentOperationId = 'parent-operation-id';
    const operationId = 'operation-id';

    let applicationinsightsTransport: ApplicationInsightsTransport;

    beforeEach(() => {
      applicationinsightsTransport = new ApplicationInsightsTransport({
        key,
        componentName,
        parentOperationId,
        operationId,
      });
    });

    test('should create a trace log when provided with a audit log', () => {
      // Arrange
      const mockLogInfo: TraceInfo = {
        projectName,
        componentName,
        message,
        level: LOG_LEVELS.AUDIT,
        meta: {},
        optionalProp: 'optional',
      };
      const expectedTraceInput: TraceTelemetry = {
        severity: SeverityLevel.Verbose,
        message,
        properties: {
          projectName,
          componentName,
          level: LOG_LEVELS.AUDIT,
          optionalProp: 'optional',
        },
      };
      // Act
      applicationinsightsTransport.log(mockLogInfo, () => { });
      // Assert
      expect(applicationinsightsTransport.client.trackTrace).toHaveBeenLastCalledWith(expectedTraceInput);
    });

    test('should create a trace log when provided with a critical log', () => {
      // Arrange
      const mockLogInfo: TraceInfo = {
        projectName,
        componentName,
        message,
        level: LOG_LEVELS.CRITICAL,
        meta: [],
        optionalProp: 'optional',
      };
      const expectedTraceInput: TraceTelemetry = {
        severity: SeverityLevel.Critical,
        message,
        properties: {
          projectName,
          componentName,
          level: LOG_LEVELS.CRITICAL,
          optionalProp: 'optional',
        },
      };
      // Act
      applicationinsightsTransport.log(mockLogInfo, () => { });
      // Assert
      expect(applicationinsightsTransport.client.trackTrace).toHaveBeenLastCalledWith(expectedTraceInput);
    });

    test('should create a trace log when provided with a debug log', () => {
      // Arrange
      const mockLogInfo: TraceInfo = {
        projectName,
        componentName,
        message,
        level: LOG_LEVELS.DEBUG,
        meta: {},
        optionalProp: 'optional',
      };
      const expectedTraceInput: TraceTelemetry = {
        severity: SeverityLevel.Verbose,
        message,
        properties: {
          projectName,
          componentName,
          level: LOG_LEVELS.DEBUG,
          optionalProp: 'optional',
        },
      };
      // Act
      applicationinsightsTransport.log(mockLogInfo, () => { });
      // Assert
      expect(applicationinsightsTransport.client.trackTrace).toHaveBeenLastCalledWith(expectedTraceInput);
    });

    test('should create a exception log with a message when provided with a error log with a message', () => {
      // Arrange
      const error: Error = new Error('Test Error');
      const mockLogInfo: ExceptionInfo = {
        error,
        message,
        projectName,
        componentName,
        level: LOG_LEVELS.ERROR,
        meta: {},
        optionalProp: 'optional',
      };
      const expectedErrorInput: ExceptionTelemetry = {
        exception: error,
        severity: SeverityLevel.Error,
        properties: {
          projectName,
          componentName,
          message,
          optionalProp: 'optional',
        },
      };
      // Act
      applicationinsightsTransport.log(mockLogInfo, () => { });
      // Assert
      expect(applicationinsightsTransport.client.trackException).toHaveBeenLastCalledWith(expectedErrorInput);
    });

    test('should create a exception log with no message when provided with a error log with no messgae', () => {
      // Arrange
      const error: Error = new Error('Test Error');
      const mockLogInfo: ExceptionInfo = {
        error,
        message: '',
        projectName,
        componentName,
        level: LOG_LEVELS.ERROR,
        meta: {},
        optionalProp: 'optional',
      };
      const expectedErrorInput: ExceptionTelemetry = {
        exception: error,
        severity: SeverityLevel.Error,
        properties: {
          projectName,
          componentName,
          optionalProp: 'optional',
        },
      };
      // Act
      applicationinsightsTransport.log(mockLogInfo, () => { });
      // Assert
      expect(applicationinsightsTransport.client.trackException).toHaveBeenLastCalledWith(expectedErrorInput);
    });

    test('should create a event log with a message when provided with a event log with a message', () => {
      // Arrange
      const mockLogInfo: EventInfo = {
        projectName,
        componentName,
        message,
        level: LOG_LEVELS.EVENT,
        name: eventName,
        meta: [],
        randomData: 'random-data',
      };
      const expectedEventInput: EventTelemetry = {
        name: eventName,
        properties: {
          projectName,
          componentName,
          message,
          randomData: 'random-data',
        },
      };
      // Act
      applicationinsightsTransport.log(mockLogInfo, () => { });
      // Assert
      expect(applicationinsightsTransport.client.trackEvent).toHaveBeenLastCalledWith(expectedEventInput);
    });

    test('should create a event log without a message when provided with a event log with no message', () => {
      // Arrange
      const mockLogInfo: EventInfo = {
        projectName,
        componentName,
        message: '',
        level: LOG_LEVELS.EVENT,
        name: eventName,
        meta: {},
      };
      const expectedEventInput: EventTelemetry = {
        name: eventName,
        properties: {
          projectName,
          componentName,
        },
      };
      // Act
      applicationinsightsTransport.log(mockLogInfo, () => { });
      // Assert
      expect(applicationinsightsTransport.client.trackEvent).toHaveBeenLastCalledWith(expectedEventInput);
    });

    test('should create a trace log when provided with a info log', () => {
      // Arrange
      const mockLogInfo: TraceInfo = {
        projectName,
        componentName,
        message,
        level: LOG_LEVELS.INFO,
        meta: {},
        optionalProp: 'optional',
      };
      const expectedTraceInput: TraceTelemetry = {
        severity: SeverityLevel.Information,
        message,
        properties: {
          projectName,
          componentName,
          level: LOG_LEVELS.INFO,
          optionalProp: 'optional',
        },
      };
      // Act
      applicationinsightsTransport.log(mockLogInfo, () => { });
      // Assert
      expect(applicationinsightsTransport.client.trackTrace).toHaveBeenLastCalledWith(expectedTraceInput);
    });

    test('should create a trace log when provided with a security log', () => {
      // Arrange
      const mockLogInfo: TraceInfo = {
        projectName,
        componentName,
        message,
        level: LOG_LEVELS.SECURITY,
        meta: {},
        optionalProp: 'optional',
      };
      const expectedTraceInput: TraceTelemetry = {
        severity: SeverityLevel.Information,
        message,
        properties: {
          projectName,
          componentName,
          level: LOG_LEVELS.SECURITY,
          optionalProp: 'optional',
        },
      };
      // Act
      applicationinsightsTransport.log(mockLogInfo, () => { });
      // Assert
      expect(applicationinsightsTransport.client.trackTrace).toHaveBeenLastCalledWith(expectedTraceInput);
    });

    test('should create a trace log when provided with a warning log', () => {
      // Arrange
      const mockLogInfo: TraceInfo = {
        projectName,
        componentName,
        message,
        level: LOG_LEVELS.WARNING,
        meta: {},
        optionalProp: 'optional',
      };
      const expectedTraceInput: TraceTelemetry = {
        severity: SeverityLevel.Warning,
        message,
        properties: {
          projectName,
          componentName,
          level: LOG_LEVELS.WARNING,
          optionalProp: 'optional',
        },
      };
      // Act
      applicationinsightsTransport.log(mockLogInfo, () => { });
      // Assert
      expect(applicationinsightsTransport.client.trackTrace).toHaveBeenLastCalledWith(expectedTraceInput);
    });
  });
});
