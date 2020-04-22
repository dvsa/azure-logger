import Logger from './logger';
import ILogger from './ILogger';

const logger = new Logger();

export { logger, ILogger as Logger };


// TODO - REMOVE For testing
logger.info('Test Log');
