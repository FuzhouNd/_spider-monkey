// import { send } from '@/server';
import { useCallBack } from '@/server/index';
import { exec } from '@/server/message';
import { ExecFuncParams } from '@/browser/executor/type';
import { range } from 'ramda';

const imgUrlList: string[] = [];


const func = async ({ delay, R, data }: ExecFuncParams) => {
  const sl = data as string[];
  await delay(3 * 1000);
  const aList = [...document.querySelectorAll('._3glhOBhU img')].filter((d) => {
    const src = (d as HTMLImageElement)?.src || '';
    return !sl.includes(src as string) && src.endsWith('webp');
  }) as HTMLImageElement[];
  for (const a of aList) {
    setTimeout(() => {
      a?.click();
    }, 2000);
    return aList
      .map((d) => d?.src || '')
      .filter((d) => d)
      .slice(0, 1);
  }
  // html?.scrollBy(0, 1000);
  // await delay(2000);
};

useCallBack(async ({ ws, message }) => {
  if (message.content.url.includes('https://mobile.yangkeduo.com/search_result.html')) {
   
    const resData = await exec(ws, func, imgUrlList);
    imgUrlList.push(...(resData || []));
    console.log(resData, 'resData');
  }
  // data.data
});
useCallBack(async ({ ws, message }) => {
  if (message.content.url.includes('https://mobile.yangkeduo.com/goods.html')) {
    const func = async ({ delay, R, data }: ExecFuncParams) => {
      await delay(6000);
      window.history.back();
      return 1;
    };
    const data = await exec(ws, func, imgUrlList);
  }
  // console.log(data);
  // data.data
});
