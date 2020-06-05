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

1) Create a file logger.ts and export the azure logger from it, instantiating it with the project and component names.
```typescript
import { Logger } from '@dvsa/azure-logger';

export default new Logger('ftts', 'ftts-location-api');
```

2. Whenever you want to log an item import the logger.ts file. You must always pass in the azure context into the logger on every calls so that you can trace all logs in a single function call.
```typescript
import logger from './logger';

function getData(context: Context): void {
    try {
        // Do calculations
    } catch(error) {
        logger.error(context, error);
    }
}
```

## APPINSIGHTS_INSTRUMENTATIONKEY

 When using an Azure app function the following environment variable must be present and contain the key for the application insights instance you wish to use.
  
  APPINSIGHTS_INSTRUMENTATIONKEY