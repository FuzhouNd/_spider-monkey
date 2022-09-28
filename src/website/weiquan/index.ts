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
import path from 'path';
// add stealth plugin and use defaults (all evasion techniques)
puppeteer.use(StealthPlugin());

(async () => {
  const cluster = await Cluster.launch({
    puppeteer,
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 1,
    puppeteerOptions: {
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
      headless: true,
    },
  });

  await cluster.task(async ({ page, data }) => {
    await page.goto(data.url, { waitUntil: 'load' });
    await delay(4000);
    const dList = await page.$$eval('h3[itemprop="name"] a', (dl) =>
      dl.map((d) => ({ title: d.textContent || '', href: d.getAttribute('href') }))
    );
    await writeCsv(path.resolve(__dirname, './d.csv'), dList);
    // Store screenshot, do something else
  });

  const urlList1 = R.range(1, 13).map((v) => {
    return `https://wqw2010.blogspot.com/2017/${v.toString().padStart(2, '0')}/`;
  });
  const urlList2 = R.range(1, 13).map((v) => {
    return `https://wqw2010.blogspot.com/2018/${v.toString().padStart(2, '0')}/`;
  });
  const urlList3 = R.range(1, 13).map((v) => {
    return `https://wqw2010.blogspot.com/2019/${v.toString().padStart(2, '0')}/`;
  });
  const urlList4 = R.range(1, 13).map((v) => {
    return `https://wqw2010.blogspot.com/2020/${v.toString().padStart(2, '0')}/`;
  });
  const urlList5 = R.range(1, 13).map((v) => {
    return `https://wqw2010.blogspot.com/2021/${v.toString().padStart(2, '0')}/`;
  });
  console.log([...urlList2, ...urlList3, ...urlList4, ...urlList5]);
  for (const url of [...urlList2, ...urlList3, ...urlList4, ...urlList5]) {
    cluster.queue({ url });
  }
  // many more pages

  await cluster.idle();
  await cluster.close();
})();
