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
import { movieList } from './data';
// add stealth plugin and use defaults (all evasion techniques)
puppeteer.use(StealthPlugin());

(async () => {
  const existList = await readCsv('./data/mm.csv')
  const cluster = await Cluster.launch({
    puppeteer,
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 1,
    puppeteerOptions: {
      executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
      headless: false,
    },
  });
  await cluster.task(async ({ page, data: movie }) => {
    const mvUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie[2])}&ref_=nv_sr_sm`;
    await page.goto(mvUrl, { waitUntil: 'load' });
    const linkList = await page.$$eval('.result_text', (ll) =>
      ll.map((l) => ({ title: l.textContent || '', link: l.querySelector('a')?.href || '' }))
    );
    // https://www.imdb.com/title/tt13462900/?ref_=fn_al_tt_1
    const matchedMov = linkList
      .map((link) => {
        const id = link.link?.match(/tt[0-9]+/)?.[0] || '';
        const year = parseInt(link.title.match(/([0-9]+)/)?.[1] || '', 10);
        return { id, year };
      })
      .find((mov) => {
        if (Number.isNaN(mov.year)) {
          return false;
        }
        const sourceYear = parseInt(movie[1].split('.')[0], 10);
        return Math.abs(mov.year - sourceYear) < 5;
      });
    if (!matchedMov?.id) {
      console.log('找不到', movie, linkList);
      return;
    } else {
      // console.log(matchedMov);
    }
    // www.imdb.com/title/tt13462900/reviews?ref_=tt_urv
    await page.goto(`https://www.imdb.com/title/${matchedMov?.id}/reviews/?ref_=fn_al_tt_1`, { waitUntil: 'load' });
    await page.waitForTimeout(4000);
    const title = (await page.$eval('[itemprop="name"]', (l) => l.textContent || '')).replace(/[\r\n]/g, '').replace(/[\s]+(?![\S]+)/g, '');
    while (true) {
      await page.waitForTimeout(4000);
      const btn = await page.$('.ipl-load-more__button');
      if(!btn){
        break
      }
      const isDisabled = await page.$eval('.ipl-load-more__button', l => l&&getComputedStyle(l).display === 'none')
      if (!isDisabled) {
        await btn.click();
      } else {
        break;
      }
    }
    const containerList = await page.$$('.lister-list .review-container');
    console.log(title, containerList.length);

    for (const container of containerList) {
      const text = await container.$eval('.content .text', (l) => l.textContent || '');
      // zhTitle,title,cast,year,sourceYear,comment
      await writeCsv('./data/mm.csv', [
        {
          zhTitle: movie[0],
          title,
          cast: '',
          year: matchedMov?.year,
          sourceYear: movie[1],
          comment: text.replace(/[\r\n]/g, ''),
        },
      ]);
    }
    // Store screenshot, do something else
  });
  for (const movie of movieList) {
    if(!existList.some(e => e.zhTitle === movie[0])){
      cluster.queue(movie);
    } else {
      console.log('jump', movie);
    }
  }

  // many more pages

  await cluster.idle();
  await cluster.close();
})();
