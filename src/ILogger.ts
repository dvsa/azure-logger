export default interface ILogger {
  critical(message: string, properties?: {[key: string]: string}): void;
  error(error: Error, message?: string, properties?: {[key: string]: string}): void;
  warn(message: string, properties?: {[key: string]: string}): void;
  info(message: string, properties?: {[key: string]: string}): void;
  debug(message: string, properties?: {[key: string]: string}): void;
  log(message: string, properties?: {[key: string]: string}): void;
  audit(message: string, properties?: {[key: string]: string}): void;
  security(message: string, properties?: {[key: string]: string}): void;
  event(name: string, message? : string, properties?: {[key: string]: string}): void;
}
