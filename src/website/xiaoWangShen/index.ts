import { useCallback } from '@/server/utils/server';
import { exec } from '@/server/utils/message';
import { createPage } from '@/server/utils/puppeteer';
import { getAllWs, getWsById, removeWs, waitForWs } from '@/server/utils/wsStore';
import { delay } from '@/utils';
import { writeCsv, readCsv } from '@/fs';
import dayjs from 'dayjs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import * as R from 'ramda';
import glob from 'glob';
import path from 'path';
import fs from 'fs-extra';

dayjs.extend(dayOfYear);

const existDataList = glob.sync('./data/source/*.csv', { absolute: true }).map((_path) => {
  const parsedPath = path.parse(_path);
  let ret = {
    id: '',
    date: '',
  };
  parsedPath.name.split(' ').forEach((str, index) => {
    if (index === 1) {
      // 本店商品ID_640139791264
      ret.id = str.split('_')[1];
    }
    if (index === 3) {
      // 本店商品ID_640139791264
      ret.date = str.split('_')[0];
    }
  });
  return ret;
});

useCallback(async () => {
  const argv = await yargs(hideBin(process.argv)).argv;
  const range = argv['range'] as string;
  const [d1, d2] = range.split('~').map((d) => dayjs(d, 'YYYY-MM-DD'));

  const _idList = await readCsv<string[]>('./data/source.csv', { headers: false });
  const idList = _idList.map((id) => id[0]).filter((d) => d);
  for (const index of R.range(0, d2.dayOfYear() - d1.dayOfYear() + 1)) {
    const date = d1.add(index, 'day');
    for (const id of idList) {
      if (existDataList.find((d) => d.id === id && d.date === date.format('YYYY-MM-DD'))) {
        console.log('已存在,跳过', date.format('YYYY-MM-DD'), id);
        continue;
      }
      const ws = await createPage(
        `https://sycm.taobao.com/cc/item_archives?activeKey=flow&dateRange=${date.format('YYYY-MM-DD')}%7C${date.format(
          'YYYY-MM-DD'
        )}&dateType=day&itemId=${id}&spm=a21ag.23983127.0.4.6a2750a5TLQqdE`
      );
      await exec(ws.ws, async ({ delay }) => {
        await delay(3000);
        const btn = [...document.querySelectorAll<HTMLSpanElement>('.oui-tab-switch-item')].find((e) =>
          (e.textContent || '').includes('上一跳来源')
        );
        if (btn) {
          btn.click();
        }
        await delay(2000);
        const xBtn = document.querySelector<HTMLButtonElement>('#xws-product360-flow-source button');
        if (xBtn) {
          xBtn.click();
        }
        await delay(3000);
        const csvBtn = document.querySelector<HTMLButtonElement>('[value="csv"] button');
        await delay(2000);
        if (csvBtn) {
          csvBtn.click();
        }
        setTimeout(() => {
          window.close();
        }, 2000);
      });
      console.log('已获取', date.format('YYYY-MM-DD'), id);
    }
  }
  console.log('获取完毕');
  await delay(5000)
  combine();
  console.log('csv文件合并完毕');
});

function combine() {
  if (fs.pathExistsSync('./data/combine.csv')) {
    fs.rmSync('./data/combine.csv');
  }
  glob
    .sync('./data/source/*.csv', { absolute: true })
    .sort((a, b) => {
      const parsedPathA = path.parse(a);
      const parsedPathB = path.parse(b);
      let retA = {
        id: '',
        date: '',
      };
      let retB = {
        id: '',
        date: '',
      };
      parsedPathA.name.split(' ').forEach((str, index) => {
        if (index === 1) {
          // 本店商品ID_640139791264
          retA.id = str.split('_')[1];
        }
        if (index === 3) {
          retA.date = str.split('_')[0];
        }
      });
      parsedPathB.name.split(' ').forEach((str, index) => {
        if (index === 1) {
          // 本店商品ID_640139791264
          retB.id = str.split('_')[1];
        }
        if (index === 3) {
          // 本店商品ID_640139791264
          retB.date = str.split('_')[0];
        }
      });
      return dayjs(retA.date, 'YYYY-MM-DD').valueOf() - dayjs(retB.date, 'YYYY-MM-DD').valueOf();
    })
    .forEach(async (_path) => {
      const dataList = await readCsv<any>(_path);
      await writeCsv('./data/combine.csv', dataList);
    });
}
