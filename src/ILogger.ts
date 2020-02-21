/* eslint-disable @typescript-eslint/no-explicit-any */
export default interface ILogger {
  critical(message: string, ...optionalParams: any[]): void;
  error(message: string, ...optionalParams: any[]): void;
  warn(message: string, ...optionalParams: any[]): void;
  info(message: string, ...optionalParams: any[]): void;
  debug(message: string, ...optionalParams: any[]): void;
  log(message: string, ...optionalParams: any[]): void;
  audit(message: string, ...optionalParams: any[]): void;
  security(message: string, ...optionalParams: any[]): void;
}
