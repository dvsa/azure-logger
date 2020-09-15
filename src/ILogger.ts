/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line import/no-unresolved
import { Context } from '@azure/functions';

export type Props = { [key: string]: any };

export default interface ILogger {
  critical(message: string, properties?: Props): void;
  critical(context: Context, message: string, properties?: Props): void;

  error(error: Error, message?: string, properties?: Props): void;
  error(context: Context, error: Error, message?: string, properties?: Props): void;

  warn(message: string, properties?: Props): void;
  warn(context: Context, message: string, properties?: Props): void;

  info(message: string, properties?: Props): void;
  info(context: Context, message: string, properties?: Props): void;

  debug(message: string, properties?: Props): void;
  debug(context: Context, message: string, properties?: Props): void;

  log(message: string, properties?: Props): void;
  log(context: Context, message: string, properties?: Props): void;

  audit(message: string, properties?: Props): void;
  audit(context: Context, message: string, properties?: Props): void;

  security(message: string, properties?: Props): void;
  security(context: Context, message: string, properties?: Props): void;

  event(name: string, message?: string, properties?: Props): void;
  event(context: Context, name: string, message?: string, properties?: Props): void;

  dependency(context: Context, name: string, data?: string, properties?: Props): void;

  request(context: Context, name: string, properties?: Props): void;
}
