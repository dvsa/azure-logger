/* eslint-disable @typescript-eslint/no-explicit-any */
import winston from 'winston';
import Logger from '../../src/logger';
import ApplicationInsightsTransport from '../../src/applicationInsightsTransport';
import { LOG_LEVELS } from '../../src/enums';

jest.mock('../../src/applicationInsightsTransport');
jest.mock('../../src/config', () => ({
  logs: {
    level: 'DEBUG',
  },
  applicationInsights: {
    key: '123-456-789',
  },
}));

describe('Logger', () => {
  let loggerInstance: Logger;
  let mockCreateLogger;
  const mockLogger: any = {
    error: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    log: jest.fn(),
    warn: jest.fn(),
    request: jest.fn(),
    dependency: jest.fn(),
  };
  const mockContext: any = {
    traceContext:
    {
      traceparent: '00-763230142f4317478bf6bdcee3886ef0-2839ff750bf4cc46-00',
    },
  };
  const logMessage = 'test log message';
  const logProps = { componentName: 'azure-logger', projectName: 'DVSA', operationId: '763230142f4317478bf6bdcee3886ef0' };

  beforeAll(() => {
    mockCreateLogger = jest.spyOn(winston, 'createLogger');
    mockCreateLogger.mockImplementation(() => mockLogger);
  });

  beforeEach(() => {
    loggerInstance = new Logger('DVSA', 'azure-logger');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    test('should correctly configure application insights', () => {
      // assert
      expect(ApplicationInsightsTransport).toHaveBeenCalledWith({
        level: 'DEBUG',
        key: '123-456-789',
        componentName: 'azure-logger',
      });
    });
  });

  describe('critical', () => {
    test('should create a critical log', () => {
      // act
      loggerInstance.critical(mockContext, logMessage);
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.CRITICAL,
        logMessage,
        logProps,
      );
    });

    test('should create a critical log with optional properties', () => {
      // act
      loggerInstance.critical(mockContext, logMessage, { isTest: 'true' });
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.CRITICAL,
        logMessage,
        { ...logProps, isTest: 'true' },
      );
    });
  });

  describe('debug', () => {
    test('should create a debug log', () => {
      // act
      loggerInstance.debug(mockContext, logMessage);
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.DEBUG,
        logMessage,
        logProps,
      );
    });

    test('should create a debug log with optional properties', () => {
      // act
      loggerInstance.debug(mockContext, logMessage, { isTest: 'true' });
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.DEBUG,
        logMessage,
        { ...logProps, isTest: 'true' },
      );
    });
  });

  describe('audit', () => {
    test('should create a audit log', () => {
      // act
      loggerInstance.audit(mockContext, logMessage);
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.AUDIT,
        logMessage,
        logProps,
      );
    });

    test('should create a audit log with optional properties', () => {
      // act
      loggerInstance.audit(mockContext, logMessage, { isTest: 'true' });
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.AUDIT,
        logMessage,
        { ...logProps, isTest: 'true' },
      );
    });
  });

  describe('security', () => {
    test('should create a security log', () => {
      // act
      loggerInstance.security(mockContext, logMessage);
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.SECURITY,
        logMessage,
        logProps,
      );
    });

    test('should create a security log with optional properties', () => {
      // act
      loggerInstance.security(mockContext, logMessage, { isTest: 'true' });
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.SECURITY,
        logMessage,
        { ...logProps, isTest: 'true' },
      );
    });
  });

  describe('error', () => {
    const mockError = new Error('Mock Error');

    test('should create a error log', () => {
      // act
      loggerInstance.error(mockContext, mockError);
      // assert
      expect(mockLogger.error).toHaveBeenCalledWith(
        '',
        { ...logProps, error: mockError },
      );
    });

    test('should create a error log with an optional error message', () => {
      // act
      loggerInstance.error(mockContext, mockError, logMessage);
      // assert
      expect(mockLogger.error).toHaveBeenCalledWith(
        logMessage,
        { ...logProps, error: mockError },
      );
    });

    test('should create a error log with optional properties', () => {
      // act
      loggerInstance.error(mockContext, mockError, undefined, { isTest: 'true' });
      // assert
      expect(mockLogger.error).toHaveBeenCalledWith(
        '',
        { ...logProps, error: mockError, isTest: 'true' },
      );
    });

    test('should create a error log with an optional message and properties', () => {
      // act
      loggerInstance.error(mockContext, mockError, logMessage, { isTest: 'true' });
      // assert
      expect(mockLogger.error).toHaveBeenCalledWith(
        logMessage,
        { ...logProps, error: mockError, isTest: 'true' },
      );
    });
  });

  describe('info', () => {
    test('should create a info log', () => {
      // act
      loggerInstance.info(mockContext, logMessage);
      // assert
      expect(mockLogger.info).toHaveBeenCalledWith(
        logMessage,
        logProps,
      );
    });

    test('should create a info log with optional properties', () => {
      // act
      loggerInstance.info(mockContext, logMessage, { isTest: 'true' });
      // assert
      expect(mockLogger.info).toHaveBeenCalledWith(
        logMessage,
        { ...logProps, isTest: 'true' },
      );
    });
  });

  describe('log', () => {
    test('should create a log', () => {
      // act
      loggerInstance.log(mockContext, logMessage);
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.INFO,
        logMessage,
        logProps,
      );
    });

    test('should create a log with additional properties', () => {
      // act
      loggerInstance.log(mockContext, logMessage, { isTest: 'true' });
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.INFO,
        logMessage,
        { ...logProps, isTest: 'true' },
      );
    });
  });

  describe('warn', () => {
    test('should create a warn log', () => {
      // act
      loggerInstance.warn(mockContext, logMessage);
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.WARNING,
        logMessage,
        logProps,
      );
    });

    test('should create a warn log with optional properties', () => {
      // act
      loggerInstance.warn(mockContext, logMessage, { isTest: 'true' });
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.WARNING,
        logMessage,
        { ...logProps, isTest: 'true' },
      );
    });
  });

  describe('event', () => {
    const mockEventName = 'mock-event';
    const mockEventMessage = 'mock-event-message';

    test('should create a event log', () => {
      // act
      loggerInstance.event(mockContext, mockEventName);
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.EVENT,
        '',
        { ...logProps, name: mockEventName },
      );
    });

    test('should create a event with an optional message', () => {
      // act
      loggerInstance.event(mockContext, mockEventName, mockEventMessage);
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.EVENT,
        mockEventMessage,
        { ...logProps, name: mockEventName },
      );
    });

    test('should create a event with optional properties', () => {
      // act
      loggerInstance.event(mockContext, mockEventName, undefined, { isTest: 'true' });
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.EVENT,
        '',
        { ...logProps, name: mockEventName, isTest: 'true' },
      );
    });

    test('should create a event with an optional message and properties', () => {
      // act
      loggerInstance.event(mockContext, mockEventName, mockEventMessage, { isTest: 'true' });
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.EVENT,
        mockEventMessage,
        { ...logProps, name: mockEventName, isTest: 'true' },
      );
    });
  });

  describe('dependency', () => {
    const mockDependencyName = 'mock-dependency';

    test('should create a dependency log', () => {
      // act
      loggerInstance.dependency(mockContext, mockDependencyName);
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.DEPENDENCY,
        mockDependencyName,
        expect.objectContaining({ ...logProps }),
      );
    });
  });

  describe('request', () => {
    const mockRequestName = 'mock-request';

    test('should create a request log', () => {
      // act
      loggerInstance.request(mockContext, mockRequestName);
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.REQUEST,
        mockRequestName,
        expect.objectContaining({ ...logProps }),
      );
    });
  });
});
