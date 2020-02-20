# Logger
Dvsa FTTS uses Winston as the logging facade. 

## Usage
Firstly, install the library
```
npm install @dvsa/azure-logger
```

or if using Yarn

```
yarn add @dvsa/azure-logger
```

Specify the environment variables in an .env file, for example

```
LOG_LEVEL=debug
NODE_ENV=development
```

Import the logger
```typescript
import { Logger } from '@dvsa/azure-logger';

// create an instance
const loggerInstance = Logger.Instance;

// do some logging!
loggerInstance.log('Hello World');
loggerInstance.error('Error %o', err);
```

## Logging Levels

 * critical
 * error
 * warn
 * info
 * debug
 * security
 * audit
 * log
