import { readFile } from '@/fs/index';
import { uniq } from 'ramda';
import { writeFile } from '@/fs';

(async () => {
  const mmap = readFile('./data/sc.csv').reduce((re, line) => {
    const [id, sub, school] = line;
    re[school] = uniq([...(re[school] || []), sub]);
    return re;
  }, {} as { [key: string]: any });
  const lList = Object.keys(mmap).map((school) => {
    return { school, subList: mmap[school] };
  });
  writeFile(
    './data/scF.csv',
    lList.map((l) => `${l.school};${l.subList.join(',')};${l.subList.some((s: string) => s.includes('Chinese')) ? '是' : '否'}`)
  );
})();
