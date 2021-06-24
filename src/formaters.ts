import { IRecord, IFormater } from './interfaces';
import stringify from './stringify';

export class SimpleFormater implements IFormater {
  constructor(private template: string = '') {}

  getFormatted(record: IRecord, name: string) {
    let value = record[name];
    if (!value) {
      return '';
    }
    const formatMethod = `format${name.charAt(0).toUpperCase()}${name.slice(1)}`;
    if (typeof this[formatMethod] == 'function') {
      value = this[formatMethod](value);
    }
    return value;
  }

  format(record: IRecord): string {
    const template = this.template || '{name} | {levelName}: {msg}{exception}{extra}';
    return template.replace(/\{(.+?)\}/g, (_, name) => {
      return this.getFormatted(record, name);
    });
  }

  formatCreated(date: Date): string {
    const pad = (len: number, num: number | string, char = '0') => {
      num = `${num}`;
      len = len - num.length;
      while (len > 0) {
        num = `${char}${num}`;
        len -= 1;
      }
      return num;
    };
    const pad10 = (num: number) => pad(2, num);
    const pad100 = (num: number) => pad(3, num);

    return [
      date.getUTCFullYear(),
      '-',
      pad10(date.getUTCMonth()),
      '-',
      pad10(date.getUTCDate()),
      'T',
      pad10(date.getUTCHours()),
      ':',
      pad10(date.getUTCMinutes()),
      ':',
      pad10(date.getUTCSeconds()),
      '.',
      pad100(date.getUTCMilliseconds()),
      'Z',
    ].join('');
  }

  formatException(einfo: any): string {
    let result = ` Error: ${einfo.message || ''}`;

    if (einfo.config && einfo.config.url) {
      result += `\nurl: ${einfo.config.url}`;
    }
    if (einfo.code) {
      result += `\ncode: ${einfo.code}`;
    }
    if (einfo.response && einfo.response.status && einfo.response.statusText) {
      result += `\nstatus: ${einfo.response.status} (${einfo.response.statusText})`;
    }
    if (einfo.stack) {
      result += `\nstack: ${einfo.stack}`;
    }
    if (result.indexOf('\n') >= 0) {
      return `${result}\n`;
    }
    return result;
  }

  formatExtra(data: any): string {
    let result: string;
    try {
      result = stringify(data);
    } catch {
      try {
        result = JSON.stringify(data);
      } catch {
        result = '<not serializable data>';
      }
    }
    if (result === '{}' || result === '') {
      return '';
    }
    return ` ${result}`;
  }
}
