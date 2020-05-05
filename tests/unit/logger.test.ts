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

  beforeAll(() => {
    mockCreateLogger = jest.spyOn(winston, 'createLogger');
    mockCreateLogger.mockImplementation(() => mockLogger);
    loggerInstance = new Logger('DVSA', 'azure-logger');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('configures application insights', () => {
    // act
    loggerInstance.log('Test Log');

    // assert
    expect(ApplicationInsightsTransport).toHaveBeenCalledWith({
      level: 'DEBUG',
      key: '123-456-789',
    });
  });

  test('critical logs', () => {
    // arrange
    const message = 'Critical log';

    // act
    loggerInstance.critical(message);

    // assert
    expect(mockLogger.log).toHaveBeenCalledWith(
      LOG_LEVELS.CRITICAL,
      message,
      { componentName: 'azure-logger', projectName: 'DVSA' },
    );
  });

  test('debug logs', () => {
    // arrange
    const message = 'Debug log';

    // act
    loggerInstance.debug(message);

    // assert
    expect(mockLogger.log).toHaveBeenCalledWith(
      LOG_LEVELS.DEBUG,
      message,
      { componentName: 'azure-logger', projectName: 'DVSA' },
    );
  });

  test('audit logs', () => {
    // arrange
    const message = 'Audit log';

    // act
    loggerInstance.audit(message);

    // assert
    expect(mockLogger.log).toHaveBeenCalledWith(
      LOG_LEVELS.AUDIT,
      message,
      { componentName: 'azure-logger', projectName: 'DVSA' },
    );
  });

  test('security logs', () => {
    // arrange
    const message = 'Audit log';

    // act
    loggerInstance.security(message);

    // assert
    expect(mockLogger.log).toHaveBeenCalledWith(
      LOG_LEVELS.SECURITY,
      message,
      { componentName: 'azure-logger', projectName: 'DVSA' },
    );
  });

  test('error logs', () => {
    // arrange
    const message = 'Error log';
    const error: Error = new Error('Test Error');
    // act
    loggerInstance.error(error, message);

    // assert
    expect(mockLogger.error).toHaveBeenCalledWith(
      message,
      { componentName: 'azure-logger', projectName: 'DVSA', error },
    );
  });

  test('info logs', () => {
    // arrange
    const message = 'Info log';

    // act
    loggerInstance.info(message);

    // assert
    expect(mockLogger.info).toHaveBeenCalledWith(
      message,
      { componentName: 'azure-logger', projectName: 'DVSA' },
    );
  });

  test('log logs', () => {
    // arrange
    const message = 'Log log';

    // act
    loggerInstance.log(message);

    // assert
    expect(mockLogger.log).toHaveBeenCalledWith(
      LOG_LEVELS.INFO,
      message,
      { componentName: 'azure-logger', projectName: 'DVSA' },
    );
  });

  test('warn logs', () => {
    // arrange
    const message = 'Warn log';

    // act
    loggerInstance.warn(message);

    // assert
    expect(mockLogger.log).toHaveBeenCalledWith(
      LOG_LEVELS.WARNING,
      message,
      { componentName: 'azure-logger', projectName: 'DVSA' },
    );
  });

  test('event logs call the logger with the correct data when no optional data is provided', () => {
    // Act
    loggerInstance.event('mock-name');

    // Assert
    expect(mockLogger.log).toHaveBeenCalledWith(LOG_LEVELS.EVENT, '', {
      componentName: 'azure-logger',
      projectName: 'DVSA',
      name: 'mock-name',
    });
  });

  test('event logs call the logger with the correct data when all optional data is provided', () => {
    // Act
    loggerInstance.event('mock-name', 'mock-message', { mockData: 'mock-data' });

    // Assert
    expect(mockLogger.log).toHaveBeenCalledWith(LOG_LEVELS.EVENT, 'mock-message', {
      componentName: 'azure-logger',
      projectName: 'DVSA',
      mockData: 'mock-data',
      name: 'mock-name',
    });
  });
});
