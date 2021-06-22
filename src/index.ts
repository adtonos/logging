import { Manager } from './manager';
import { ILogger } from './interfaces';
export * from './interfaces';
export { Filter, Filterer } from './filter';
export { SimpleFormater } from './formaters';
export { Logger } from './logger';
export { BaseHandler, ConsoleHandler } from './handlers';
export * from './stringify';

const manager = new Manager();

export function getLogger(name?: string): ILogger {
  return manager.getLogger(name);
}
