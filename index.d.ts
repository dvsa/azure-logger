export interface ILogger {
  critical(message: string, ...optionalParams: object[]): void;
  error(message: string, ...optionalParams: object[]): void;
  warn(message: string, ...optionalParams: object[]): void;
  info(message: string, ...optionalParams: object[]): void;
  debug(message: string, ...optionalParams: object[]): void;
  log(message: string, ...optionalParams: object[]): void;
  audit(message: string, ...optionalParams: object[]): void;
  security(message: string, ...optionalParams: object[]): void;
}
