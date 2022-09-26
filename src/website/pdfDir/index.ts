import fs from 'fs-extra';
import { toText } from '@/pdf';
import glob from 'glob';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import path from 'path';

(async () => {
  const argv = await yargs(hideBin(process.argv)).argv;
  if (!argv.path) {
    console.log('需要path参数');
  }
  const outPath = (argv.path as string) + '/out';
  if (fs.pathExistsSync(outPath)) {
    fs.rmSync(outPath, { recursive: true });
  }
  const filePathList = glob.sync((argv.path + '/*.pdf') as string, { absolute: true });
  for (const filePath of filePathList) {
    // console.log(filePath);
    const index = path.parse(filePath).name.split('_')[1];
    const text = await toText(filePath);
    const title = text.match(/[\S]+/)?.[0];
    // 名：王晓东
    const name = text.match(/姓名：([\S]{2,3})/)?.[1];
    // 岗位：河南事业部经理助理（主持工作）
    const job = (text.match(/岗位：([\S]*)/)?.[1] || '').replace(/（主持工作）/, '');
    const dirName = `${outPath}/${name} ${job}`;
    if (fs.pathExistsSync(dirName)) {
      console.log('重复', dirName);
    }
    fs.mkdirSync(dirName, { recursive: true });
    fs.copyFileSync(filePath, dirName + `/${name} ${job} ${title}.pdf`);
  }
  // filePathList.map((filePath) => {
  //   console.log(filePath);
  // });
})();
