export type LevelType = string | number;

export interface IRecord {
  readonly name: string;
  readonly level: LevelType;
  readonly levelName?: string;
  readonly msg?: string;
  readonly exception?: any;
  readonly timestamp: number;
  readonly created: Date;
  readonly extra?: any;
}

export interface IFilter {
  filter(record: IRecord): boolean;
}

export interface IFormater {
  format(record: IRecord): string;
}

export interface IHandler {
  readonly level: number;
  setFormater(formater: IFormater): void;
  handle(record: IRecord): void;
  emit(record: IRecord): void;
  flush(): void;
  close(): void;
}

export interface ILogger {
  readonly name: string;
  readonly parent?: ILogger;

  setParent(parent: ILogger): void;
  setLevel(level: LevelType): void;
  addHandler(handler: IHandler): ILogger;
  removeHandler(handler: IHandler): ILogger;
  hasHandlers(): boolean;
  getHandlers(): IHandler[];
  fatal(msg: string, exception?: any, extra?: any): void;
  critical(msg: string, exception?: any, extra?: any): void;
  error(msg: string, exception?: any, extra?: any): void;
  warn(msg: string, exception?: any, extra?: any): void;
  warning(msg: string, exception?: any, extra?: any): void;
  info(msg: string, exception?: any, extra?: any): void;
  debug(msg: string, exception?: any, extra?: any): void;
  exception(exception: any, extra?: any): void;
  log(level: number, msg: string, exception?: any, extra?: any): void;
}
