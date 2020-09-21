import { Context } from '@azure/functions';

// App insights logs accept property values of any type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Props = { [key: string]: any };

export default interface ILogger {
  critical(message: string, properties?: Props): void;
  error(error: Error, message?: string, properties?: Props): void;
  warn(message: string, properties?: Props): void;
  info(message: string, properties?: Props): void;
  debug(message: string, properties?: Props): void;
  log(message: string, properties?: Props): void;
  audit(message: string, properties?: Props): void;
  security(message: string, properties?: Props): void;
  event(name: string, message?: string, properties?: Props): void;
  dependency(context: Context, name: string, data?: string, properties?: Props): void;
  request(context: Context, name: string, properties?: Props): void;
}
