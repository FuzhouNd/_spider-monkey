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
    await page.goto('https://wenshu.court.gov.cn/website/wenshu/181217BMTKHNT2W0/index.html');
    await delay(10000);
    if (!(await page.$('#loginLi'))) {
      await page.reload();
      await delay(10000);
    }
    const itemList = await page.$$('.listTMain.clearfix [role="treeitem"]');
    for (const item of itemList) {
      const isT = await item.evaluate((d) => /^刑事案由/.test(d.textContent || ''));
      if (isT) {
        const icon = await item.$('.jstree-icon.jstree-ocl');
        if (!icon) {
          console.log('刑事icon');
          return;
        }
        await icon.click();
        break;
      }
    }
    await delay(1000);

    const itemList2 = await page.$$('.listTMain.clearfix [role="treeitem"]');
    for (const item of itemList2) {
      const isT = await item.evaluate((d) => /^贪污贿赂/.test(d.textContent || ''));
      if (isT) {
        console.log('贪污 click');
        await item.click();
        break;
      }
    }
    await delay(6000);

    const itemList3 = await page.$$('.listTMain.clearfix [role="treeitem"]');
    for (const item of itemList3) {
      const isT = await item.evaluate((d, data) => new RegExp(`^${data.year}`).test(d.textContent || ''), data);
      if (isT) {
        console.log('year click');
        await item.click();
        break;
      }
    }
    await delay(6000);

    const itemList4 = await page.$$('.listTMain.clearfix [role="treeitem"]');
    for (const item of itemList4) {
      const isT = await item.evaluate((d) => /^四川省/.test(d.textContent || ''));
      if (isT) {
        const icon = await item.$('.jstree-icon.jstree-ocl');
        if (!icon) {
          console.log('四川icon');
          return;
        }
        await icon.click();
        break;
      }
    }
    await delay(1000);

    const itemList5 = await page.$$('.listTMain.clearfix [role="treeitem"]');
    for (const item of itemList5) {
      const isT = await item.evaluate((d, data) => new RegExp(`^${data.faYuan}`).test(d.textContent || ''), data);
      if (isT) {
        await item.click();
        break;
      }
    }
    await delay(60 * 1000);
    while (true) {
      const hrefList = await page.$$eval('.caseName', (dl) => dl.map((d) => d.getAttribute('href')));
      await writeCsv(
        './data/cp.csv',
        hrefList.map((d) => ({ href: d }))
      );
      const nextBtnList = await page.$$('.pageButton');
      let hasI = false
      for (const nextBtn of nextBtnList) {
        if (await nextBtn.evaluate((d) => d.textContent === '下一页')) {
          hasI = true;
          await nextBtn.click();
          await delay(6000)
          break
        }
      }
      if(!hasI){
        break
      }
    }
    // itemList.find(i => i.evaluate(d => d.textContent === data.zui))

    // Store screenshot, do something else
  });
  cluster.queue('', async ({ page }) => {
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
        break;
      } else {
        index += 1;
        await page.reload();
        await delay(8000);
      }
    }
    await page.waitForTimeout(4000);
  });
  const sourceData = [
    {
      year: '2020', //2020
      faYuan: '四川省雅安市中级人民法院', // aria-labelledby="N00_anchor"   aria-labelledby="NE0_anchor"
      zui: '贪污受贿罪',
    },
  ];
  for (const data of sourceData) {
    cluster.queue({ url: `${data.faYuan}-${data.year}`, ...data });
  }
  // many more pages

  await cluster.idle();
  await cluster.close();
})();
