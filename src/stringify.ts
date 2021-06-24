// data serialization from Winston 2.x (MIT License)
// https://github.com/winstonjs/winston/blob/2.x/lib/winston/common.js#L321

export default function stringify(obj: any, key?: string | symbol): string {
  // symbols cannot be directly casted to strings
  if (typeof key === 'symbol') {
    key = key.toString();
  }
  if (typeof obj === 'symbol') {
    obj = obj.toString();
  }

  if (obj === null) {
    obj = 'null';
  } else if (obj === undefined) {
    obj = 'undefined';
  } else if (obj === false) {
    obj = 'false';
  }

  if (typeof obj !== 'object' || (obj && obj.stack && obj.message)) {
    return key ? `${key}=${obj}` : obj;
  }

  if (obj instanceof Buffer) {
    return key ? `${key}=${obj.toString('base64')}` : obj.toString('base64');
  }

  let msg = '',
    keys = Object.keys(obj),
    length = keys.length;

  for (let i = 0; i < length; i++) {
    if (Array.isArray(obj[keys[i]])) {
      msg += `${keys[i]}=[`;

      for (let j = 0, l = obj[keys[i]].length; j < l; j++) {
        msg += stringify(obj[keys[i]][j]);
        if (j < l - 1) {
          msg += ', ';
        }
      }

      msg += ']';
    } else if (obj[keys[i]] instanceof Date) {
      msg += `${keys[i]}=${obj[keys[i]]}`;
    } else {
      msg += stringify(obj[keys[i]], keys[i]);
    }

    if (i < length - 1) {
      msg += ', ';
    }
  }

  return msg;
}
