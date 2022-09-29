import fetch from 'node-fetch';
import fs from 'fs-extra';
import { JSDOM } from 'jsdom';
import dayjs from 'dayjs';
import { readCsv, writeCsv } from '@/fs';
import { delay } from '@/utils';
// import puppeteer from 'puppeteer-core';
import * as R from 'ramda';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Cluster } from 'puppeteer-cluster';
import browser from '@/browser';
// add stealth plugin and use defaults (all evasion techniques)
puppeteer.use(StealthPlugin());

(async () => {
  const sourceData = await readCsv('./data/zheJiang.csv');
  let cTitle = '';
  let ii = 0;
  const _data = sourceData.map((data: any) => {
    const title = data['公告标题'] || '';
    if (cTitle === title) {
      ii += 1;
    } else {
      ii = 0
    }
    cTitle = title;
    const v = (data['中标金额（元）'] || '').split(' ')[ii] || '';
    data['中标金额（元）'] = v
    return data
  });
  await writeCsv('./data/zheJiang-format.csv', _data)
})();
