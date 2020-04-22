/* eslint-disable @typescript-eslint/no-explicit-any */
import { setup, defaultClient, TelemetryClient } from 'applicationinsights';
import Transport from 'winston-transport';

import { ApplicationInsightsTransportOptions } from './interfaces';

class ApplicationInsightsTransport extends Transport {
  client: TelemetryClient;

  constructor(options: ApplicationInsightsTransportOptions) {
    super(options);
    if (options.client) {
      this.client = options.client;
    } else if (options.appInsights) {
      this.client = options.appInsights.defaultClient;
    } else {
      setup(options.key).start();
      this.client = defaultClient;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  log(info: any, callback: Function): void {
    this.client.trackEvent({
      name: 'Test Event',
    });
  }
}

export default ApplicationInsightsTransport;
