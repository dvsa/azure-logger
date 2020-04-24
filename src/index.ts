import Logger from './logger';
import ILogger from './ILogger';

export { Logger, ILogger };


// TODO - REMOVE For testing
const logger = new Logger('FTTS', 'logging system');
logger.event('EVENT_LOG', 'Test Message', { test: '123456', test2: false });
logger.audit('Test Audit Log');
logger.critical('Test Critical Log');
logger.debug('Test Debug Log');
logger.error('Test Error Log');
logger.info('Test Info Log');
logger.log('Test Log');
logger.security('Test Security Log');
logger.warn('Test Warning Log');
