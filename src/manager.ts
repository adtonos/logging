import { LEVELS } from './consts';
import { ILogger } from './interfaces';
import { Logger } from './logger';
import { checkLevel } from './utils';

export class Manager {
  public disable: number;

  private _loggers: Map<string, ILogger>;
  private _root: ILogger | null;

  constructor(root = null, level = LEVELS.NOTSET) {
    this._root = root;
    this._loggers = new Map();
    this._loggers.set('root', new Logger('root'));
    this.disable = checkLevel(level);
  }

  public setDisable(level: number) {
    this.disable = checkLevel(level);
  }

  /**
   * Find logger by name. Create is not exits
   */
  public getLogger(name = 'root'): ILogger {
    if (!this._loggers.has(name)) {
      const logger = new Logger(name);
      this._fixTree(logger);
      logger.manager = this;
      this._loggers.set(name, logger);
    }
    return this._loggers.get(name) as ILogger;
  }

  public _fixTree(logger: ILogger) {
    const parts = logger.name.replace('/', '.').split('.');
    while (parts.length) {
      parts.pop();
      const name = parts.join('.') || 'root';
      const parent = this._loggers.get(name);
      if (parent) {
        logger.setParent(parent);
        break;
      }
    }
    if (logger.parent) {
      for (const item of this._loggers.values()) {
        if (item.parent && item.parent === logger.parent) {
          if (item.name.substr(0, logger.name.length) === logger.name) {
            item.setParent(logger);
          }
        }
      }
    }
  }
}
