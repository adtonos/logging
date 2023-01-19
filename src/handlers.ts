import { LEVELS } from './consts';
import { Filterer } from './filter';
import { SimpleFormater } from './formaters';
import { IFormater, IHandler, IRecord, LevelType } from './interfaces';
import { checkLevel } from './utils';

export abstract class BaseHandler extends Filterer implements IHandler {
  public level: number;
  protected formater: IFormater = new SimpleFormater();

  constructor(level: LevelType = LEVELS.NOTSET) {
    super();
    this.level = checkLevel(level);
  }
  public setFormater(formater: IFormater): void {
    this.formater = formater;
  }
  public setLevel(level: LevelType) {
    this.level = checkLevel(level);
  }

  public handle(record: IRecord) {
    if (this.filter(record)) {
      this.emit(record);
      return true;
    }
    return false;
  }
  public emit(record: IRecord) {
    // eslint-disable-line
    throw new Error('Not implemented');
  }
  public flush() {
    /* noopa */
  }
  public close() {
    /* noopa */
  }
}

export class ConsoleHandler extends BaseHandler {
  public emit(record: IRecord): void {
    console.log(this.formater.format(record));
  }
}

export class CountRepeatsConsoleHandler extends BaseHandler {
  private prefixLen: number;
  private lastLogLine: string = '';
  private repeatsCount: number = 0;

  constructor(level: LevelType = LEVELS.NOTSET, prefixLen: number = 0) {
    super(level);
    this.prefixLen = prefixLen;
  }

  protected rawEmit(text: string) {
    console.log(text);
  }

  public emit(record: IRecord): void {
    const fullLogLine = this.formater.format(record);
    const logLine = fullLogLine.slice(this.prefixLen);

    if (logLine === this.lastLogLine) {
      this.repeatsCount += 1;
      return;
    }
    if (this.repeatsCount > 0) {
      this.rawEmit(`The last line was repeated ${this.repeatsCount} more times.`)
      this.repeatsCount = 0;
    }
    this.lastLogLine = logLine;
    this.rawEmit(fullLogLine);
  }
}
