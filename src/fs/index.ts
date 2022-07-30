import fs from 'fs-extra';
import R from 'ramda';
import path from 'path';

type OB = { [key: string]: string | number };

export function mkDir(filePath: string) {
  const parsedPath = path.parse(filePath);
  fs.mkdirSync(parsedPath.dir, { recursive: true });
}

export function writeFile(filePath: string, data: OB[] | OB | string | string[] | undefined) {
  if (!data) {
    return;
  }
  mkDir(filePath);
  if (typeof data === 'string') {
    fs.writeFileSync(filePath, data + '\r\n', { flag: 'a' });
    return;
  }
  if (!Array.isArray(data) && typeof data === 'object') {
    if (!fs.pathExistsSync(filePath)) {
      fs.writeFileSync(filePath, R.keys(data).join(';') + '\r\n', { flag: 'a' });
    }
    const text = fs.readFileSync(filePath, { encoding: 'utf-8' });
    if (!text) {
      fs.writeFileSync(filePath, R.keys(data).join(';') + '\r\n', { flag: 'a' });
    }
    fs.writeFileSync(filePath, R.values(data).join(';') + '\r\n', { flag: 'a' });
    return;
  }
  data.forEach((d) => {
    writeFile(filePath, d);
  });
}

export function readFile(filePath: string) {
  if (!fs.pathExistsSync(filePath)) {
    return '';
  }
  return fs
    .readFileSync(filePath, { encoding: 'utf-8' })
    .split('\r\n')
    .filter((d) => d)
    .map((d) => d.split(';'));
}
