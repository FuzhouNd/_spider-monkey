// import { send } from '@/server';
import { useCallBack } from '@/server/utils/server';
import { exec } from '@/server/utils/message';
import { ExecFuncParams } from '@/browser/executor/type';
import { range } from 'ramda';
import { writeFile } from '@/fs';

const imgUrlList: string[] = [];

const browserFunc = async ({ delay, R, data }: ExecFuncParams) => {
  const sl = data as string[];
  await delay(3 * 1000);
  let aList: HTMLImageElement[] = [];
  while (true) {
    aList = [...document.querySelectorAll('._3glhOBhU img')].filter((d) => {
      const src = (d as HTMLImageElement)?.src || '';
      return !sl.includes(src as string) && src.endsWith('webp');
    }) as HTMLImageElement[];
    if (!aList.length) {
      document.querySelector('html')?.scrollBy(0, 1000);
    } else {
      break;
    }
  }
  for (const a of aList) {
    setTimeout(() => {
      a?.click();
    }, 2000);
    return aList
      .map((d) => d?.src || '')
      .filter((d) => d)
      .slice(0, 1);
  }
};

useCallBack(async ({ ws, message }) => {
  if (message.content.url.includes('https://mobile.yangkeduo.com/search_result.html')) {
    const resData = await exec(ws, browserFunc, imgUrlList);
    imgUrlList.push(...(resData || []));
    console.log(imgUrlList, 'imgUrlList');
  }
  // data.data
});
useCallBack(async ({ ws, message }) => {
  if (message.content.url.includes('https://mobile.yangkeduo.com/goods.html')) {
    const func = async ({ delay, R, data }: ExecFuncParams) => {
      const price = document.querySelector('[data-uniqid="11"] [role="button"]')?.textContent || '';
      const title = document.querySelector('.enable-select')?.textContent || '';
      const name = document.querySelector('._1g9X2Rjz')?.textContent || '';
      setTimeout(() => {
        window.history.back();
      }, 6000);
      return { price, title, name };
    };
    const data = await exec(ws, func, imgUrlList);
    writeFile('./data/pdd.csv', data)
  }
});
