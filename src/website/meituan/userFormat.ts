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
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
      headless: false,
    },
  });

  function getText(x: number, y: number, svgText: string) {
    const svgDocument = new JSDOM(svgText).window.document;
    const textList = [...svgDocument.querySelectorAll('text')];
    const nx = -x;
    const ny = -y;
    const textDom = textList.find((textDom) => {
      const tx = parseInt(textDom.getAttribute('x') || '', 10);
      const ty = parseInt(textDom.getAttribute('y') || ' ', 10);
      if (ty >= ny) {
        return true;
      }
    });
    if (textDom) {
      const n = Math.floor(nx / 14);
      const c = textDom.textContent?.at(n);
      return c;
    }
    return '';
  }

  await cluster.task(async ({ page, data }) => {
    if (!data.url2) {
      return;
    }
    await page.goto(data.url2);
    await delay(10000);
    const address = await page.$eval('.user-groun', (d) => d.textContent || '');
    const isMan = !!(await page.$('.user-groun .man'));
    const sex = isMan ? 'man' : 'woman';
    await writeCsv(path.resolve(__dirname, './exFormat.csv'), [{ sex, address,...data.item,}])
    // console.log(dataList);
  });

  const res = await cluster.execute({ url: 'login' }, async ({ page }) => {
    await page.goto('https://account.dianping.com/pclogin');
    await delay(10000);
  });
  // if (!res) {
  //   console.log('no login');
  //   await cluster.idle();
  //   await cluster.close();
  //   return;
  // }
  const data = (await readCsv(path.resolve(__dirname, './ex.csv'))) as { name: string; nameLink: string }[];
  for (const item of data) {
    cluster.queue({ url: item.name, url2: item.nameLink, item });
  }
  await cluster.idle();
  await cluster.close();
  // many more pages
})();
