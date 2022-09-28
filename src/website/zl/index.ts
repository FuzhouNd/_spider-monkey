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
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
      headless: true,
    },
  });

  await cluster.task(async ({ page, data }) => {
    await page.goto(data['链接'], { waitUntil: 'load' });
    await page.waitForTimeout(6000);
    const clickList = await page.$$('.callerCompany span');
    let delay = 30000;
    if (clickList.length >= 3) {
      delay = 20000;
    }
    for (const sp of clickList) {
      await sp.click();
      await page.waitForTimeout(delay);
      const pages = await page.browser().pages();
      const npage = pages.find((d) => d.url().includes('company'));
      let address = '';
      let count = '';
      let total = '';
      let support = '';
      let companyName = '';
      let concatList: string[] = [];
      if (npage) {
        companyName = await npage.$eval('.titInfo .titInfo', (d) => d.textContent || '');
        address = (
          await npage.$$eval('.contactLine li', (dl) => dl.find((d) => d.textContent?.includes('地址'))?.textContent || '')
        ).replace(/[\s]*/g, '');
        const vl = await npage.$$eval('.sectionCon.dataInfo li  p:nth-child(2)', (dl) => dl.map((d) => d.textContent || '0'));
        count = vl[0];
        total = vl[1];
        support = vl[2];
        concatList = await npage.$$eval('[class="personCon"]', (dl) => dl.map((d) => d.textContent || ''));
        await writeCsv('./data/zheJiang.csv', [
          {
            ...R.map((d) => d.replace(/[\r\n]+/g, ' '), data),
            中标公司: companyName,
            公司地址: address,
            招标数量: count,
            招标总金额: total,
            供应商数量: support,
            中标联系人: concatList,
          },
        ]);
        // console.log({ companyName, address, count, total, support, concatList });
        await npage.close();
      }
    }

    // Store screenshot, do something else
  });
  cluster.queue('', async ({ page }) => {
    await page.goto('https://www.zhiliaobiaoxun.com/login', { waitUntil: 'load' });
    await page.waitForTimeout(4000);
    const tab = await page.$('div.tab:nth-child(2)');
    if (tab) {
      await tab.click();
      const inp = await page.$('[placeholder="请输入手机号"]');
      await inp?.type('13002558195');
      // await inp?.$eval?.('input', d => d.value = '')
      const inp2 = await page.$('[type="password"]');
      await inp2?.type('qwe123456');
      const btn = await page.$('[class="registerBtn"] button');
      await btn?.click?.();
      await page.waitForTimeout(4000);
    }
  });
  const sourceData = (await readCsv(path.resolve(__dirname, './zheJiang.csv'))) as any[];
  for (const data of sourceData) {
    cluster.queue({ url: data['公告标题'], ...data });
  }
  // many more pages

  await cluster.idle();
  await cluster.close();
})();
