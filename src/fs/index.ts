import fs from 'fs-extra';
import R from 'ramda';
import path from 'path';
import * as _fs from 'fs';
import * as csv from 'fast-csv';

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
    return [];
  }
  return fs
    .readFileSync(filePath, { encoding: 'utf-8' })
    .split('\r\n')
    .filter((d) => d)
    .map((d) => d.split(';'));
}

export function readCsv(filePath: string): Promise<unknown[]> {
  return new Promise<unknown[]>((resolve, reject) => {
    if(!fs.pathExistsSync(filePath)){
      return []
    }
    const re: unknown[] = [];
    _fs
      .createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on('error', (error) => reject(error))
      .on('data', (row) => re.push(row))
      .on('end', (rowCount: number) => resolve(re));
  });
}

type RowMap<V = any> = Record<string, V>;
type RowHashArray<V = any> = [string, V][];
type RowArray = string[];
type Row = RowArray | RowHashArray | RowMap;
export async function writeCsv<T>(filepath: string, data: Row[]) {
  if (!fs.pathExistsSync(filepath)) {
    const str = await csv.writeToString(data, { headers: true });
    fs.writeFileSync(filepath, str + '\r\n', { flag: 'a' });
  } else if (fs.readFileSync(filepath, { encoding: 'utf-8' }) === '') {
    const str = await csv.writeToString(data, { headers: true });
    fs.writeFileSync(filepath, str + '\r\n', { flag: 'a' });
  } else {
    const str = await csv.writeToString(data);
    fs.writeFileSync(filepath, str + '\r\n', { flag: 'a' });
  }
}
