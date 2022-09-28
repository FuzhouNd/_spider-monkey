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
    maxConcurrency: 5,
    monitor: true,
    puppeteerOptions: {
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
      headless: true,
    },
  });

  await cluster.task(async ({ page, data }) => {
    await page.goto(data.url, { waitUntil: 'load' });
    await delay(3000);
    const date = await page.$eval('.date-header', (d) => d.textContent || '');
    const content = await page.$eval('.post-body.entry-content', (d) => d.textContent || '');
    await writeCsv(path.resolve(__dirname, './full.csv'), [
      {
        date: date.replace(/[\r\n]+/g, ' '),
        title: data.title,
        url: data.url,
        content: content.replace(/[\r\n]+/g, ' '),
      },
    ]);
    // Store screenshot, do something else
  });

  const dataList = (await readCsv(path.resolve(__dirname, './d.csv'))) as { title: string; href: string }[];
  for (const data of dataList) {
    cluster.queue({ url: data.href, ...data });
  }
  // many more pages

  await cluster.idle();
  await cluster.close();
})();
