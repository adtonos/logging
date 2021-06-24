import { LEVEL_NAMES, LEVELS } from './consts';
import { Filterer } from './filter';
import { IHandler, ILogger, IRecord, LevelType } from './interfaces';
import { checkLevel, isError } from './utils';

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

  public fatal(msg: string, exception?: any, extra?: any) {
    this.log(LEVELS.FATAL, msg, exception, extra);
  }

  public critical(msg: string, exception?: any, extra?: any) {
    this.log(LEVELS.CRITICAL, msg, exception, extra);
  }

  public error(msg: string, exception?: any, extra?: any) {
    this.log(LEVELS.ERROR, msg, exception, extra);
  }

  public warn(msg: string, exception?: any, extra?: any) {
    this.log(LEVELS.WARN, msg, exception, extra);
  }

  public warning(msg: string, exception?: any, extra?: any) {
    this.log(LEVELS.WARN, msg, exception, extra);
  }

  public info(msg: string, exception?: any, extra?: any) {
    this.log(LEVELS.INFO, msg, exception, extra);
  }

  public debug(msg: string, exception?: any, extra?: any) {
    this.log(LEVELS.DEBUG, msg, exception, extra);
  }

  public exception(exception: any, extra?: any) {
    this.log(LEVELS.ERROR, exception.message, exception, extra);
  }

  public log(level: number, msg: string, exception?: any, extra?: any) {
    if (exception && !isError(exception)) {
      extra = exception;
      exception = null;
    }

    level = checkLevel(level);
    if (this._isEnabledFor(level)) {
      const now = new Date();
      this.handle({
        created: now,
        timestamp: Math.floor(now.getTime() / 1000),
        name: this.name,
        level,
        levelName: LEVEL_NAMES[level] as string,
        msg,
        exception,
        extra,
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
