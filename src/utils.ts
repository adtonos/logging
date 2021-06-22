import { LEVELS } from './consts';

const NAMES = Object.keys(LEVELS);

export function levelToMask(level: number) {
    return level === LEVELS.NOTSET ? LEVELS.NOTSET : level * 2 - 1;
}

export function checkLevel(level: number | string): number {
    const type = typeof level;
    if (type === 'number') {
        return level as number;
    } else if (type === 'string') {
        level = (level as string).toUpperCase();
        if (NAMES.includes('' + level)) {
            return LEVELS[level] as number;
        }
    }
    const msg = `Level not number or valid string: "${level}" [${NAMES}]`;
    throw TypeError(msg);
}

export function formatDate(date: Date): string {
    const pad = (len, num, char = '0') => {
        num = `${num}`;
        len = len - num.length;
        while (len > 0) {
            num = `${char}${num}`;
            len -= 1;
        }
        return num;
    };
    const pad10 = num => pad(2, num);
    const pad100 = num => pad(3, num);

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
