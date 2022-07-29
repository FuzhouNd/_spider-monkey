import fs from 'fs-extra';
import R from 'ramda';

type OB = { [key: string]: string | number };

export function writeFile(filePath: string, data: OB[] | OB | string | string[] | undefined) {
  if (!data) {
    return;
  }
  if (typeof data === 'string') {
    fs.writeFileSync(filePath, data + '\r\n', { flag: 'a' });
    return;
  }
  if (!Array.isArray(data) && typeof data === 'object') {
    fs.writeFileSync(filePath, R.values(data).join(';') + '\r\n', { flag: 'a' });
    return;
  }
  data.forEach((d) => {
    writeFile(filePath, d);
  });
}

export function readFile(filePath: string) {
  return fs
    .readFileSync(filePath, { encoding: 'utf-8' })
    .split('\r\n')
    .filter((d) => d)
    .map((d) => d.split(';'));
}
