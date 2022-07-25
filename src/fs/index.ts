import fs from 'fs-extra';
import R from 'ramda';

type OB = { [key: string]: string | number };

export function writeFile(filePath: string, data: OB[] | OB | string | string[] | string[][]) {
  if (typeof data === 'string') {
    fs.writeFileSync(filePath, data + '\r\n', { flag: 'a' });
    return;
  }
  if (!Array.isArray(data) && typeof data === 'object') {
    fs.writeFileSync(filePath, R.values(data).join(';') + '\r\n', { flag: 'a' });
    return;
  }

  data.map((d, index, arr) => {
    if (typeof d === 'string' && index === 0) {
      fs.writeFileSync(filePath, arr.join(';') + '\r\n', { flag: 'a' });
      return;
    }
    if (typeof d === 'object' && !Array.isArray(d)) {
      const strList = R.values(d).join(';') + '\r\n';
      fs.writeFileSync(filePath, strList, { flag: 'a' });
    }
    if (Array.isArray(d)) {
      fs.writeFileSync(filePath, d.join(';') + '\r\n', { flag: 'a' });
    }
  });
}

export function readFile(filePath: string) {
  return fs
    .readFileSync(filePath, { encoding: 'utf-8' })
    .split('\r\n')
    .filter((d) => d)
    .map((d) => d.split(';'));
}
