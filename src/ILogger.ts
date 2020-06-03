export default interface ILogger {
  critical(message: string, operationId: string, properties?: {[key: string]: string}): void;
  error(error: Error, operationId: string, message?: string, properties?: {[key: string]: string}): void;
  warn(message: string, operationId: string, properties?: {[key: string]: string}): void;
  info(message: string, operationId: string, properties?: {[key: string]: string}): void;
  debug(message: string, operationId: string, properties?: {[key: string]: string}): void;
  log(message: string, operationId: string, properties?: {[key: string]: string}): void;
  audit(message: string, operationId: string, properties?: {[key: string]: string}): void;
  security(message: string, operationId: string, properties?: {[key: string]: string}): void;
  event(name: string, operationId: string, message? : string, properties?: {[key: string]: string}): void;
}
