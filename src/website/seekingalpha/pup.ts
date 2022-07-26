import puppeteer from 'puppeteer-core';
import { readFile } from '@/fs';
import fs from 'fs-extra';
import { toPdf } from '@/pdf';
// import pdf from 'pdfjs';
// import puppeteer from 'puppeteer-core';
// const puppeteer = require('');
// const pdf = require('');
// const fs = require('fs-extra');

//s.wanfangdata.com.cn/patent?q=%E4%B8%AD%E5%9B%BD%E9%95%BF%E5%9F%8E%E7%A7%91%E6%8A%80%E9%9B%86%E5%9B%A2%E8%82%A1%E4%BB%BD%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8&p=1&facet=%5B%7B%22PatentType%22%3A%7B%22label%22%3A%22%E5%8F%91%E6%98%8E%E4%B8%93%E5%88%A9%22,%22value%22%3A%22%E5%8F%91%E6%98%8E%E4%B8%93%E5%88%A9%22,%22number%22%3A118,%22desc%22%3A%22%22,%22title%22%3A%22%E4%B8%93%E5%88%A9%E7%B1%BB%E5%9E%8B%22,%22children%22%3A%5B%5D%7D%7D%5D
// https: `https://s.wanfangdata.com.cn/patent?q=中国长城科技集团股份有限公司&p=1&facet=[{"PatentType":{"label":"发明专利","value":"发明专利","number":118,"desc":"","title":"专利类型","children":[]}}]`;

(async () => {
  const brow = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    headless: false,
    userDataDir: 'C:/Users/lenovo/AppData/Local/Google/Chrome/User Data',
    defaultViewport: {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2,
    },
  });
  const urlList = readFile('./data/seek.csv').map((d) => d[0]);
  if (!fs.pathExistsSync('./data/img')) {
    fs.mkdirSync('./data/img');
  }
  const page = await brow.newPage();
  for (const url of urlList) {
    const id = url.split('/')[2].split('-')[0];
    if (fs.pathExistsSync(`./data/pdf/${id}.pdf`)) {
      console.log(id, 'jump');
      continue;
    }
    await page.goto('https://seekingalpha.com' + url);
    await page.waitForTimeout(2000);
    await page.$$eval('svg', (l) => l.forEach((d) => d.remove()));
    const dom = await page.$('[data-test-id="card-container"]');
    if (dom) {
      const html = await dom.evaluate((node) => node.innerHTML);
      fs.writeFileSync(`./data/pdf/${id}.html`, html, { flag: 'a' });
      // await dom.screenshot({
      //   path: `./data/img/${id}.jpeg`,
      //   type: 'jpeg',
      //   quality: 100,
      // });
      // await toPdf([`./data/img/${id}.jpeg`], `./data/pdf/${id}.pdf`);
      console.log(id, 'make pdf success');
    }
  }
  // const linkList = await getSkList(brow, 'https://ca.ixl.com/ela/grade-2');

  // toPdf('determine-the-main-idea-of-a-passage')

  // await toPdf('match-the-short-a-and-long-a-words-to-pictures');
  // await toPdf(`match-the-short-a-and-long-a-words-to-pictures-question`);
  // await page.waitForNetworkIdle({ timeout: 8 * 1000 });
})();
