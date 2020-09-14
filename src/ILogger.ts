/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line import/no-unresolved
import { Context } from '@azure/functions';

export default interface ILogger {
  critical(context: Context, message: string, properties?: {[key: string]: string}): void;
  error(context: Context, error: Error, message?: string, properties?: {[key: string]: string}): void;
  warn(context: Context, message: string, properties?: {[key: string]: string}): void;
  info(context: Context, message: string, properties?: {[key: string]: string}): void;
  debug(context: Context, message: string, properties?: {[key: string]: string}): void;
  log(context: Context | undefined, message: string, properties?: {[key: string]: string}): void;
  audit(context: Context, message: string, properties?: {[key: string]: string}): void;
  security(context: Context, message: string, properties?: {[key: string]: string}): void;
  event(context: Context, name: string, message? : string, properties?: {[key: string]: string}): void;
  dependency(context: Context, name: string, data? : string, properties?: {[key: string]: any}): void;
  request(context: Context, name: string, properties?: {[key: string]: any}): void;
}
