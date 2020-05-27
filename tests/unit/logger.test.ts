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
  };
  const mockContext: any = {
    traceContext: {
      traceparent: 'trace-parent',
      tracestate: 'trace-state',
      attributes: {},
    },
  };
  const logMessage = 'test log message';
  const logProps = { componentName: 'azure-logger', projectName: 'DVSA' };
  const notSetupErrorMessage = 'Logger is not configured, please run Logger.setup() first';

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

  describe('setup', () => {
    test('should correctly configure application insights', () => {
      // act
      loggerInstance.setup(mockContext);
      // assert
      expect(ApplicationInsightsTransport).toHaveBeenCalledWith({
        level: 'DEBUG',
        key: '123-456-789',
        componentName: 'azure-logger',
        operationId: 'parent',
      });
    });
  });

  describe('critical', () => {
    test('should create a critical log', () => {
      // arrange
      loggerInstance.setup(mockContext);
      // act
      loggerInstance.critical(logMessage);
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.CRITICAL,
        logMessage,
        logProps,
      );
    });

    test('should create a critical log with optional properties', () => {
      // arrange
      loggerInstance.setup(mockContext);
      // act
      loggerInstance.critical(logMessage, { isTest: 'true' });
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.CRITICAL,
        logMessage,
        {...logProps, isTest: 'true'},
      );
    });

    test('should throw an error if setup has not been run', () => {
      try {
        loggerInstance.critical(logMessage);
      } catch (error) {
        expect(error.message).toEqual(notSetupErrorMessage);
      }
    });
  });

  describe('debug', () => {
    test('should create a debug log', () => {
      // arrange
      loggerInstance.setup(mockContext);
      // act
      loggerInstance.debug(logMessage);
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.DEBUG,
        logMessage,
        logProps,
      );
    });

    test('should create a debug log with optional properties', () => {
      // arrange
      loggerInstance.setup(mockContext);
      // act
      loggerInstance.debug(logMessage, { isTest: 'true' });
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.DEBUG,
        logMessage,
        { ...logProps, isTest: 'true' },
      );
    });

    test('should throw an error if setup has not been run', () => {
      try {
        loggerInstance.debug(logMessage);
      } catch (error) {
        expect(error.message).toEqual(notSetupErrorMessage);
      }
    });
  });

  describe('audit', () => {
    test('should create a audit log', () => {
      // arrange
      loggerInstance.setup(mockContext);
      // act
      loggerInstance.audit(logMessage);
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.AUDIT,
        logMessage,
        logProps,
      );
    });

    test('should create a audit log with optional properties', () => {
      // arrange
      loggerInstance.setup(mockContext);
      // act
      loggerInstance.audit(logMessage, { isTest: 'true' });
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.AUDIT,
        logMessage,
        { ...logProps, isTest: 'true' },
      );
    });

    test('should throw an error if setup has not been run', () => {
      try {
        loggerInstance.audit(logMessage);
      } catch (error) {
        expect(error.message).toEqual(notSetupErrorMessage);
      }
    });
  });

  describe('security', () => {
    test('should create a security log', () => {
      // arrange
      loggerInstance.setup(mockContext);
      // act
      loggerInstance.security(logMessage);
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.SECURITY,
        logMessage,
        logProps,
      );
    });

    test('should create a security log with optional properties', () => {
      // arrange
      loggerInstance.setup(mockContext);
      // act
      loggerInstance.security(logMessage, { isTest: 'true' });
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.SECURITY,
        logMessage,
        { ...logProps, isTest: 'true' },
      );
    });


    test('should throw an error if setup has not been run', () => {
      try {
        loggerInstance.security(logMessage);
      } catch (error) {
        expect(error.message).toEqual(notSetupErrorMessage);
      }
    });
  });

  describe('error', () => {
    const mockError = new Error('Mock Error');

    test('should create a error log', () => {
      // arrange
      loggerInstance.setup(mockContext);
      // act
      loggerInstance.error(mockError);
      // assert
      expect(mockLogger.error).toHaveBeenCalledWith(
        '',
        { ...logProps, error: mockError },
      );
    });

    test('should create a error log with an optional error message', () => {
      // arrange
      loggerInstance.setup(mockContext);
      // act
      loggerInstance.error(mockError, logMessage);
      // assert
      expect(mockLogger.error).toHaveBeenCalledWith(
        logMessage,
        { ...logProps, error: mockError },
      );
    });

    test('should create a error log with optional properties', () => {
      // arrange
      loggerInstance.setup(mockContext);
      // act
      loggerInstance.error(mockError, undefined, { isTest: 'true' });
      // assert
      expect(mockLogger.error).toHaveBeenCalledWith(
        '',
        { ...logProps, error: mockError, isTest: 'true' },
      );
    });

    test('should create a error log with an optional message and properties', () => {
      // arrange
      loggerInstance.setup(mockContext);
      // act
      loggerInstance.error(mockError, logMessage, { isTest: 'true' });
      // assert
      expect(mockLogger.error).toHaveBeenCalledWith(
        logMessage,
        { ...logProps, error: mockError, isTest: 'true' },
      );
    });

    test('should throw an error if setup has not been run', () => {
      try {
        loggerInstance.error(mockError, logMessage);
      } catch (error) {
        expect(error.message).toEqual(notSetupErrorMessage);
      }
    });
  });

  describe('info', () => {
    test('should create a info log', () => {
      // arrange
      loggerInstance.setup(mockContext);
      // act
      loggerInstance.info(logMessage);
      // assert
      expect(mockLogger.info).toHaveBeenCalledWith(
        logMessage,
        logProps,
      );
    });

    test('should create a info log with optional properties', () => {
      // arrange
      loggerInstance.setup(mockContext);
      // act
      loggerInstance.info(logMessage, { isTest: 'true' });
      // assert
      expect(mockLogger.info).toHaveBeenCalledWith(
        logMessage,
        { ...logProps, isTest: 'true' },
      );
    });

    test('should throw an error if setup has not been run', () => {
      try {
        loggerInstance.info(logMessage);
      } catch (error) {
        expect(error.message).toEqual(notSetupErrorMessage);
      }
    });
  });

  describe('log', () => {
    test('should create a log', () => {
      // arrange
      loggerInstance.setup(mockContext);
      // act
      loggerInstance.log(logMessage);
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.INFO,
        logMessage,
        logProps,
      );
    });

    test('should create a log with additional properties', () => {
      // arrange
      loggerInstance.setup(mockContext);
      // act
      loggerInstance.log(logMessage, { isTest: 'true' });
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.INFO,
        logMessage,
        { ...logProps, isTest: 'true' },
      );
    });

    test('should throw an error if setup has not been run', () => {
      try {
        loggerInstance.log(logMessage);
      } catch (error) {
        expect(error.message).toEqual(notSetupErrorMessage);
      }
    });
  });

  describe('warn', () => {
    test('should create a warn log', () => {
      // arrange
      loggerInstance.setup(mockContext);
      // act
      loggerInstance.warn(logMessage);
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.WARNING,
        logMessage,
        logProps,
      );
    });

    test('should create a warn log with optional properties', () => {
      // arrange
      loggerInstance.setup(mockContext);
      // act
      loggerInstance.warn(logMessage, { isTest: 'true' });
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.WARNING,
        logMessage,
        { ...logProps, isTest: 'true' },
      );
    });

    test('should throw an error if setup has not been run', () => {
      try {
        loggerInstance.warn(logMessage);
      } catch (error) {
        expect(error.message).toEqual(notSetupErrorMessage);
      }
    });
  });

  describe('event', () => {
    const mockEventName = 'mock-event';
    const mockEventMessage = 'mock-event-message';

    test('should create a event log', () => {
      // arrange
      loggerInstance.setup(mockContext);
      // act
      loggerInstance.event(mockEventName);
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.EVENT,
        '',
        { ...logProps, name: mockEventName },
      );
    });

    test('should create a event with an optional message', () => {
      // arrange
      loggerInstance.setup(mockContext);
      // act
      loggerInstance.event(mockEventName, mockEventMessage);
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.EVENT,
        mockEventMessage,
        { ...logProps, name: mockEventName },
      );
    });

    test('should create a event with optional properties', () => {
      // arrange
      loggerInstance.setup(mockContext);
      // act
      loggerInstance.event(mockEventName, undefined, { isTest: 'true' });
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.EVENT,
        '',
        { ...logProps, name: mockEventName, isTest: 'true' },
      );
    });

    test('should create a event with an optional message and properties', () => {
      // arrange
      loggerInstance.setup(mockContext);
      // act
      loggerInstance.event(mockEventName, mockEventMessage, { isTest: 'true' });
      // assert
      expect(mockLogger.log).toHaveBeenCalledWith(
        LOG_LEVELS.EVENT,
        mockEventMessage,
        { ...logProps, name: mockEventName, isTest: 'true' },
      );
    });

    test('should throw an error if setup has not been run', () => {
      try {
        loggerInstance.event(mockEventName);
      } catch (error) {
        expect(error.message).toEqual(notSetupErrorMessage);
      }
    });
  });
});
