# Azure Logger

Winston Logger with a custom Azure Application Insights Transport

### Logging levels
* critical
* error
* warn
* info
* debug
* security
* audit
* log
* event

## Installation

If using npm:
```
npm install @dvsa/azure-logger
```
or if using Yarn
```
yarn add @dvsa/azure-logger
```

Specify the environment variables in a .env file, for example
```
LOG_LEVEL=event

NODE_ENV=development

APPINSIGHTS_INSTRUMENTATIONKEY={APP_INSIGHTS_KEY}
```
## Example Use:

1) Create a class Logger called logger.ts. In this class we will create an instance of the Azure Logger, work out the operation id, and provide a wrapper for all the logger functions so we don't need to worry about the operation id elsewhere in the code.
```typescript
// eslint-disable-next-line import/no-unresolved
import { Context } from '@azure/functions';
import { Logger as AzureLogger, getOperationId } from '@dvsa/azure-logger';


class Logger {
  private azureLogger: AzureLogger;
  private operationId: string = '';
  private noOperationIdErrorMessage = 'configureOperationId must be run before using the logger';
  hasOperationIdBeenSet: boolean = false;

  constructor() {
    this.azureLogger = new AzureLogger('ftts', 'ftts-location-api');
  }

  configureOperationId(context: Context): void {
    this.operationId = getOperationId(context);
    this.hasOperationIdBeenSet =  true;
  }

  critical(message: string, properties?: { [key: string]: string }): void {
    this.throwIfOperationIdNotSet();
    this.azureLogger.critical(message, this.operationId, properties);
  }

  error(error: Error, message?: string, properties?: { [key: string]: string }): void {
    this.throwIfOperationIdNotSet();
    this.azureLogger.error(error, this.operationId, message, properties);
  }

  warn(message: string, properties?: { [key: string]: string }): void {
    this.throwIfOperationIdNotSet();
    this.azureLogger.warn(message, this.operationId, properties);
  }

  info(message: string, properties?: { [key: string]: string }): void {
    this.throwIfOperationIdNotSet();
    this.azureLogger.info(message, this.operationId, properties);
  }

  debug(message: string, properties?: { [key: string]: string }): void {
    this.throwIfOperationIdNotSet();
    this.azureLogger.debug(message, this.operationId, properties);
  }

  log(message: string, properties?: { [key: string]: string }): void {
    this.throwIfOperationIdNotSet();
    this.azureLogger.log(message, this.operationId, properties);
  }

  audit(message: string, properties?: { [key: string]: string }): void {
    this.throwIfOperationIdNotSet();
    this.azureLogger.audit(message, this.operationId, properties);
  }

  security(message: string, properties?: { [key: string]: string }): void {
    this.throwIfOperationIdNotSet();
    this.azureLogger.security(message, this.operationId, properties);
  }

  event(name: string, message?: string, properties?: { [key: string]: string }): void {
    this.throwIfOperationIdNotSet();
    this.azureLogger.event(name, this.operationId, message, properties);
  }

  private throwIfOperationIdNotSet() {
    if (!this.hasOperationIdBeenSet) {
      throw new Error(this.noOperationIdErrorMessage);
    }
  }
}

export default new Logger();
```

2.  At the start of the azure function call configureOperationId and pass the function context in
```typescript
import logger from './logger';

const  httpTrigger: AzureFunction = async (context: Context): Promise<void> => {
    logger.configureOperationId(context);
    // Rest of Function
};

export  default  httpTrigger;
```
3. Whenever you want to log an item use the logger.
```typescript
import logger from './logger';

function getData(): void {
    try {
        // Do calculations
    } catch(error) {
        logger.error(error);
    }
}
```

## APPINSIGHTS_INSTRUMENTATIONKEY

 When using an Azure app function the following environment variable must be present and contain the key for the application insights instance you wish to use.
  
  APPINSIGHTS_INSTRUMENTATIONKEY