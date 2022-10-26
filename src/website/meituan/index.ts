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
import download from 'download';
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
    await page.goto(data.url2);
    await delay(10000);
    let index = 1;

    const imgUrl = await page.$eval('svgmtsi', (el) => {
      const svgUrl = window.getComputedStyle(el).backgroundImage;
      return svgUrl;
    });
    const url = imgUrl.slice(5, -2);
    const res = await fetch(url, {
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'zh-CN,zh;q=0.9',
      },
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: null,
      method: 'GET',
    });
    const svgText = await res.text();
    const tList = await page.$$eval('.main-review', (elList) => {
      return elList.map((el) => {
        const wordsElem = el.querySelector('.review-words');
        const name = el.querySelector('.name')?.textContent || '';
        const imgUrlList = [...el.querySelectorAll('.review-pictures img')].map((img) => img.getAttribute('data-lazyload') || '');
        const nameLink = el.querySelector('.name')?.href || '';
        const time = el.querySelector('.time')?.textContent || '';
        const shop = el.querySelector('.shop')?.textContent || '';
        const textList = [...wordsElem.childNodes].map((child) => {
          if (child.nodeName === 'SVGMTSI') {
            const className = child.className;
            const style = window.getComputedStyle(document.querySelector(`.${className}`));
            return { x: style.backgroundPositionX.replace('px', ''), y: style.backgroundPositionY.replace('px', '') };
          }
          return { text: child.data };
        });
        return {
          name: name.replace(/[\r\n\s]+/g, ''),
          nameLink,
          imgUrlList,
          time: time.replace(/[\r\n\s]+/g, ''),
          shop: shop.replace(/[\r\n\s]+/g, ''),
          textList,
        };
      });
    });
    const dataList = tList.map((t) => {
      const comment = t.textList
        .map((node) => {
          if (node.x) {
            return getText(parseInt(node.x, 10), parseInt(node.y, 10), svgText);
          }
          return node.text;
        })
        .join('')
        .replace(/[\r\n\s]+/g, '');
      return R.omit(['textList'], { ...t, comment });
    });
    await writeCsv(path.resolve(__dirname, './ex.csv'), dataList);

    const tt = await page.$$eval('.PageLink', (dl) => {
      const numbList = dl.map((d) => parseInt((d.textContent || '').replace(/[\s]*/g, ''), 10));
      console.log(numbList);
      const max = Math.max(...numbList);
      return { max, url: (document.querySelector<HTMLLinkElement>('.PageLink')?.href || '').split('/').slice(0, -1).join('/') };
    });
    console.log(tt);
    R.range(2, tt.max + 1).forEach((index) => {
      const taskData = { url: tt.url + '/p' + index, url2: tt.url + '/p' + index };
      cluster.queue(taskData)
    });
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
  for (const url of ['https://www.dianping.com/shop/la62mOtbpKG0fALy/review_all']) {
    cluster.queue({ url, url2: url });
  }
  await cluster.idle();
  await cluster.close();
  // many more pages
})();
