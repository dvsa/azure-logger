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
LOG_LEVEL=debug

NODE_ENV=development

APPINSIGHTS_INSTRUMENTATIONKEY={APP_INSIGHTS_KEY}
```
## How to use:

1) Create a class which extends the Azure Logger called logger.ts
```typescript
import { Context } from  '@azure/functions';
import { Logger  as  AzureLogger } from  '@dvsa/azure-logger';

class Logger extends AzureLogger {
    constructor() {
        super('project-name', 'component-name');
    }

    setup(context: Context): void {
        super.setup(context);
    }
}

export default new Logger();
```

2.  At the start of the azure function call setup and pass the function context in
```typescript
import Logger from './logger';

const  httpTrigger: AzureFunction = async (context: Context): Promise<void> => {
    Logger.setup(context);
    // Rest of Function
};

export  default  httpTrigger;
```
3. Whenever you want to log an item use the logger.
```typescript
import Logger from './logger';

function getData(): void {
    try {
        // Do calculations
    } catch(error) {
        Logger.error(error);
    }
}
```

## APPINSIGHTS_INSTRUMENTATIONKEY

 When using an Azure app function the following environment variable must be present and contain the key for the application insights instance you wish to use.
  
  APPINSIGHTS_INSTRUMENTATIONKEY