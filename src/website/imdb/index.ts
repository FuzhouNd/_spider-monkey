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
    maxConcurrency: 2,
  });
  const reviewIdList:string[] = []
  await cluster.task(async ({ page, data: {url, movie} }) => {
    await page.goto(url);
    const linkHref = await page.$eval('.findList tr .result_text a', (l) => l.getAttribute('href'));
    // https://www.imdb.com/title/tt13462900/?ref_=fn_al_tt_1
    const id = linkHref?.match(/tt[0-9]+/)?.[0] || '';
    if (!id) {
      return;
    }
    // www.imdb.com/title/tt13462900/reviews?ref_=tt_urv
    await page.goto(`https://www.imdb.com/title/${id}/?ref_=fn_al_tt_1`);
    const containerList = await page.$$('.lister-list .review-container')
    containerList.forEach(async (c) => {
      const urlId = await page.$eval('.ipl-ratings-bar + a', l => l.getAttribute('href')) || '';
      if(!reviewIdList.includes(urlId)){
        const text = await page.$eval('.content .text', l => l.textContent || '');
        // zhTitle,title,cast,year,sourceYear,comment
        writeCsv('./mm.csv', {
          zhTitle:movie[0],title,cast,year,sourceYear,comment
        })
      }
    })
    // Store screenshot, do something else
  });

  cluster.queue('http://www.google.com/');
  cluster.queue('http://www.wikipedia.org/');
  // many more pages

  await cluster.idle();
  await cluster.close();
})();
