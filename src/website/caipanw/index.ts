import fetch from 'node-fetch';
import fs from 'fs-extra';
import { JSDOM } from 'jsdom';
import dayjs from 'dayjs';
import { readCsv, writeCsv } from '@/fs';
import { delay } from '@/utils';
import path from 'path';
// import puppeteer from 'puppeteer-core';
import * as R from 'ramda';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Cluster } from 'puppeteer-cluster';
import browser from '@/browser';
import { url1, url2 } from './data';
// add stealth plugin and use defaults (all evasion techniques)
puppeteer.use(StealthPlugin());

(async () => {
  const cluster = await Cluster.launch({
    puppeteer,
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 1,
    timeout: 9999999,
    monitor: true,
    puppeteerOptions: {
      executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
      headless: false,
    },
  });

  await cluster.task(async ({ page, data }) => {
    await page.goto(data.url);
    await delay(10000);
    const title = await page.$eval('.PDF_title', (d) => d.textContent || '');
    const info = await page.$eval('.dftable', (d) => d.textContent || '');
    const content = await page.$eval('.PDF_pox', (d) => d.textContent || '');
    if(!content){
      throw Error('无数据')
    }
    await writeCsv('./data/test2.csv', [
      {
        title: title.replace(/[\r\n]/g, ' '),
        info: info.replace(/[\r\n]/g, ' '),
        content: content,
      },
    ]);
    await delay(10000);
  });
  const res = await cluster.execute({ url: 'login' }, async ({ page }) => {
    await page.goto('https://wenshu.court.gov.cn/website/wenshu/181010CARHS5BS3C/index.html?open=login', { waitUntil: 'load' });
    await page.waitForTimeout(4000);
    let index = 0;
    while (index <= 3) {
      const frames = page.frames();
      const fr = frames.find((f) => f._name === 'contentIframe');
      if (fr) {
        const inp = await fr.$('[name="username"]');
        // await inp?.$eval?.('input', d => d.value = '')
        const inp2 = await fr.$('[name="password"]');
        const btn = await fr.$('.login-button-container span');
        await btn?.click?.();
        await delay(4000);
        return true;
      } else {
        index += 1;
        await page.reload();
        await delay(8000);
      }
    }
    await page.waitForTimeout(4000);
    return false;
  });
  console.log(res, 'res');
  if (!res) {
    console.log('no login');
    return;
  }
  for (const url of url2.map((u) => 'https://wenshu.court.gov.cn/website/wenshu' + u.slice(2))) {
    cluster.queue({ url });
  }
  // many more pages

  await cluster.idle();
  await cluster.close();
})();
