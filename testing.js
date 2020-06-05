/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */

// LOCAL TESTING FILE - DO NOT COMMIT
/*
  To run:
    npm run build && cp .env dist/ && node testing.js

  .env file for dev (use console log)
    LOG_LEVEL=event
    NODE_ENV=development
    APPINSIGHTS_INSTRUMENTATIONKEY=0367bb3d-8d28-48ed-b3b4-b9c4a9937e8c

  .env file for test (use app insights)
    LOG_LEVEL=event
    NODE_ENV=test
    APPINSIGHTS_INSTRUMENTATIONKEY=0367bb3d-8d28-48ed-b3b4-b9c4a9937e8c

*/

const Logger = require('./dist/index.js');

// SETUP
const projectName = 'FTTS';
const componentName = 'azure-logger';
const operationId = '763230142f4317478bf6bdcee3886ef0';

const logger = new Logger.Logger(projectName, componentName);

// TRACE LOGS
const message = 'Test message';
const properties = {
  isDevelopment: 'true',
};

logger.audit(message, operationId);
logger.critical(message, operationId, {});
logger.debug(message, operationId, properties);
logger.info(message, operationId, properties);
logger.log(message, operationId, properties);
logger.security(message, operationId, properties);
logger.warn(message, operationId, properties);

// EVENT LOGS
const eventName = 'TEST_EVENT';
const eventMessage = 'Test Message';
const eventProperties = {
  isDevelopment: 'true',
};

logger.event(eventName, operationId);
logger.event(eventName, operationId, eventMessage);
logger.event(eventName, operationId, null, eventProperties);
logger.event(eventName, operationId, eventMessage, eventProperties);


// ERROR LOGS
const error = new Error('This is a test error');
const errorMessage = 'Test Error';
const errorProperties = {
  isDevelopment: 'true',
};

logger.error(error, operationId);
logger.error(error, operationId, errorMessage);
logger.error(error, operationId, null, errorProperties);
logger.error(error, operationId, errorMessage, errorProperties);


// PICKS UP CONSOLE LOGS

console.log('Test console log');
