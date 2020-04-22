import winston from 'winston';
import Logger, { LOG_LEVELS } from '../../src/logger';
import ApplicationInsightsTransport from '../../src/applicationInsightsTransport';

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
    loggerInstance = new Logger();
    jest.mock('../../src/applicationInsightsTransport');
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
    expect(mockLogger.log).toHaveBeenCalledWith(LOG_LEVELS.CRITICAL, message);
  });

  test('debug logs', () => {
    // arrange
    const message = 'Debug log';

    // act
    loggerInstance.debug(message);

    // assert
    expect(mockLogger.log).toHaveBeenCalledWith(LOG_LEVELS.DEBUG, message);
  });

  test('audit logs', () => {
    // arrange
    const message = 'Audit log';

    // act
    loggerInstance.audit(message);

    // assert
    expect(mockLogger.log).toHaveBeenCalledWith(LOG_LEVELS.AUDIT, message);
  });

  test('security logs', () => {
    // arrange
    const message = 'Audit log';

    // act
    loggerInstance.security(message);

    // assert
    expect(mockLogger.log).toHaveBeenCalledWith(LOG_LEVELS.SECURITY, message);
  });

  test('error logs', () => {
    // arrange
    const message = 'Error log';

    // act
    loggerInstance.error(message);

    // assert
    expect(mockLogger.error).toHaveBeenCalledWith(message);
  });

  test('info logs', () => {
    // arrange
    const message = 'Info log';

    // act
    loggerInstance.info(message);

    // assert
    expect(mockLogger.info).toHaveBeenCalledWith(message);
  });

  test('log logs', () => {
    // arrange
    const message = 'Log log';

    // act
    loggerInstance.log(message);

    // assert
    expect(mockLogger.log).toHaveBeenCalledWith(LOG_LEVELS.INFO, message);
  });

  test('warn logs', () => {
    // arrange
    const message = 'Warn log';

    // act
    loggerInstance.warn(message);

    // assert
    expect(mockLogger.log).toHaveBeenCalledWith(LOG_LEVELS.WARNING, message);
  });
});
