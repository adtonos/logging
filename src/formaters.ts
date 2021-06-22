import { IRecord, IFormater } from './interfaces';

export class SimpleFormater implements IFormater {
  constructor(private template: string = '') {}
  format(record: IRecord): string {
    if (this.template) {
      return this.template.replace(/\{(.+?)\}/g, (_, name) => {
        return record[name] || name;
      });
    }
    const { name, levelName, msg } = record;
    return `${name}::${levelName}::${msg}`;
  }
}
