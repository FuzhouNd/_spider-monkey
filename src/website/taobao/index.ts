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
    await delay(5000);
    // date,title,url,price,sale,imgSrc
    const date = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const title = await page.$eval('[class*="mainTitle"]', (d) => d.textContent || '');
    const price = await page.$eval('[class*="extraPrice"] [class*="Price--extra"]', (d) => d.textContent || '');
    const sale = await page.$eval('[class*="salesDesc"]', (d) => (d.textContent || '').match(/[0-9]+/)?.[0] || '');
    const imgSrc = await page.$eval('img[class*="PicGallery--thumbnailPic"]', (d) => d.getAttribute('src') || '');
    await writeCsv('./data/test22.csv', [
      {
        date,
        title: title.replace(/[\r\n]/g, ' '),
        price,
        sale,
        imgSrc,
      },
    ]);
    await delay(5000);
  });
  const sourceDataList = (await readCsv('./data/taoBaoData.csv', { headers: false })) as string[][];

  cluster.queue({ url: 'login' }, async ({ page }) => {
    if (sourceDataList?.[0]?.[0]) {
      await page.goto(sourceDataList[0][0], { waitUntil: 'load' });
      await delay(60000);
    }
  });

  for (const [url] of sourceDataList) {
    cluster.queue({ url });
  }
  // many more pages

  await cluster.idle();
  await cluster.close();
})();
