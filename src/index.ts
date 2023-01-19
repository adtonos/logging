import { Manager } from './manager';
import { ILogger } from './interfaces';
import { SimpleFormater } from './formaters';
import { ConsoleHandler, CountRepeatsConsoleHandler } from './handlers';
import { LEVELS } from './consts';
export * from './interfaces';
export { Filter, Filterer } from './filter';
export { SimpleFormater } from './formaters';
export { Logger } from './logger';
export { BaseHandler, ConsoleHandler } from './handlers';
export { default as stringify } from './stringify';

const manager = new Manager();

export function getLogger(name?: string): ILogger {
  return manager.getLogger(name);
}

let defaultLogger: ILogger;

export function getDefaultLogger(): ILogger {
  if (!defaultLogger) {
    const TARGET = process.env.NODE_ENV || 'devel';
    const LOG_LEVEL = process.env.LOGLEVEL || (TARGET === 'production' ? 'INFO' : 'DEBUG');
    defaultLogger = getLogger(process.env.APP_NAME || '');
    const formatter = new SimpleFormater('{created} - {levelName}: {msg}{exception}{extra}');
    const consoleHandler = new CountRepeatsConsoleHandler(LOG_LEVEL, 24); // 24 is the length of a date created with {created} in formatter
    consoleHandler.setFormater(formatter);
    defaultLogger.addHandler(consoleHandler);
  }
  return defaultLogger;
}
