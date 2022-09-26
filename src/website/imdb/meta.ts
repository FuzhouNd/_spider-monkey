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
  const cluster = await Cluster.launch({
    puppeteer,
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 1,
    puppeteerOptions: {
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
      headless: false,
    },
  });

  await cluster.task(async ({ page, data: movie }) => {
    await page.goto(`https://www.metacritic.com/search/movie/${encodeURIComponent(movie[2])}/results`, { waitUntil: 'load' });
    await page.waitForTimeout(4000);
    const year = parseInt(movie[1].split('.')[0], 10);
    const mm = await page.$$eval('.result', (ll) =>
      ll.map((l) => {
        const year = parseInt((l.querySelector(' .main_stats p')?.textContent || '').match(/[0-9]+/)?.[0] || '0', 10);
        const link = l.querySelector('.main_stats a')?.href || '';
        return { year, link };
      })
    );
    console.log(mm, year);
    const mv = mm.find((m) => Math.abs(m.year - year) < 5);
    if (!mv?.link) {
      console.log('no found', movie);
      return;
    } else {
      console.log('found', movie);
    }
    const title = (mv.link || '').split('/').slice(-1)[0];
    console.log(title, mv.link + '/user-reviews');
    // https://www.metacritic.com/movie/jurassic-world/user-reviews
    await page.goto(mv.link + '/user-reviews', { waitUntil: 'domcontentloaded' });
    console.log('ddddd');
    while (true) {
      await page.waitForTimeout(2000);
      console.log('cy');
      const commentList = await page.$$eval('.summary .review_body', (ll) => ll.map((l) => l.textContent || ''));
      console.log('write', title, commentList.length);
      for (const comment of commentList) {
        await writeCsv('./data/mmmm.csv', [
          {
            zhTitle: movie[0],
            title,
            cast: '',
            year: mv.year,
            sourceYear: year,
            comment: comment.replace(/[\r\n]/g, '').replace(/[\s]+(?![\S]+)/, ''),
          },
        ]);
      }
      const nextLink = await page.$('.flipper.next a');
      if (nextLink) {
        await nextLink.click();
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
      } else {
        console.log('fins');
        break;
      }
    }

    // Store screenshot, do something else
  });
  for (const movie of movieList.slice(3)) {
    cluster.queue(movie);
  }
  // many more pages

  await cluster.idle();
  await cluster.close();
})();
