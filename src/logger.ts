import { LEVEL_NAMES, LEVELS } from './consts';
import { Filterer } from './filter';
import { IHandler, ILogger, IRecord, LevelType } from './interfaces';
import { checkLevel, formatDate } from './utils';

export class Logger extends Filterer implements ILogger {
  public manager?: any;

  private _parent?: ILogger;
  private _propagate: boolean;
  private _handlers: Set<IHandler>;

  constructor(public readonly name: string, private level = LEVELS.NOTSET) {
    super();
    this.name = name;
    this.level = checkLevel(level);
    this._handlers = new Set();
    this._propagate = true;
  }

  public get parent() {
    return this._parent;
  }

  public setParent(parent: ILogger): void {
    this._parent = parent;
  }

  public setLevel(level: LevelType) {
    this.level = checkLevel(level);
  }

  public addHandler(handler: IHandler): ILogger {
    if (!this._handlers.has(handler)) {
      this._handlers.add(handler);
    }
    return this;
  }

  public removeHandler(handler: IHandler): ILogger {
    this._handlers.delete(handler);
    return this;
  }

  public hasHandlers(): boolean {
    return this._handlers.size > 0;
  }

  public getHandlers(): IHandler[] {
    return Array.from(this._handlers);
  }

  public fatal(msg: string, exception?: any) {
    this.log(LEVELS.FATAL, msg, exception);
  }

  public critical(msg: string, exception?: any) {
    this.log(LEVELS.CRITICAL, msg, exception);
  }

  public error(msg: string, exception?: any) {
    this.log(LEVELS.ERROR, msg, exception);
  }

  public warn(msg: string, exception?: any) {
    this.log(LEVELS.WARN, msg, exception);
  }

  public warning(msg: string, exception?: any) {
    this.log(LEVELS.WARN, msg, exception);
  }

  public info(msg: string) {
    this.log(LEVELS.INFO, msg);
  }

  public debug(msg: string) {
    this.log(LEVELS.DEBUG, msg);
  }

  public exception(exception: any) {
    this.log(LEVELS.ERROR, exception.message, exception);
  }

  public log(level: number, msg: string, exception?: any) {
    level = checkLevel(level);
    if (this._isEnabledFor(level)) {
      const now = new Date();
      this.handle({
        created: formatDate(now),
        createdDate: now,
        timestamp: Math.floor(now.getTime() / 1000),
        name: this.name,
        level,
        levelName: LEVEL_NAMES[level] as string,
        msg,
        exception,
      });
    }
  }

  public _isEnabledFor(level: number) {
    if (this.manager && this.manager.disable > level) {
      return false;
    }
    return level >= this._getParentLevel();
  }

  public handle(record: IRecord) {
    if (this.filter(record)) {
      let p = this as Logger;
      while (p) {
        const handlers = p.getHandlers();
        for (const handler of handlers) {
          if (record.level >= handler.level) {
            handler.handle(record);
          }
        }
        if (!p._propagate) {
          break;
        }
        p = p.parent as Logger;
      }
    }
  }

  public _getParentLevel() {
    let logger = this as Logger;
    while (logger) {
      if (logger.level) {
        return logger.level;
      }
      logger = logger.parent as Logger;
    }
    return LEVELS.NOTSET;
  }
}
