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

export function isError(err: any) {
  return err && err.stack && err.message;
}
