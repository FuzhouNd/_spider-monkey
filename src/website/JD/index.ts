import fetch from 'node-fetch';
import fs from 'fs-extra';
import path from 'path';
import { TableData, Info } from './type';
import { readFile, writeFile } from '@/fs';
import { range } from 'ramda';
import { delay } from '@/utils';

const Cookie = fs.readFileSync(path.resolve(__dirname, './cookie.txt'), { encoding: 'utf-8' });
async function get(page: number) {
  const res = await fetch('https://gxpt.jd.com/vender/channelCenter/findPurchaser', {
    // @ts-ignore
    credentials: 'include',
    headers: {
      Cookie,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:103.0) Gecko/20100101 Firefox/103.0',
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'zh-CN,en-US;q=0.7,en;q=0.3',
      'Content-Type': 'application/x-www-form-urlencoded',
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
    },
    referrer: 'https://gxpt.jd.com/vender/channelCenter/dxRecruit.htm?menuId=73496005',
    body: `sellerId=&shopName=&companyName=&cgIdOne=&cgIdTwo=&cgIdThree=&index=${page}&pageSize=10&sellerPin=`,
    method: 'POST',
    mode: 'cors',
  });
  const data = (await res.json()) as TableData;
  const sellerIdList = data.data.data.map((d) => d.sellerId); 
  if (!sellerIdList.length) {
    console.log('break at', page);
    return;
  }
  // console.log(sellerIdList);
  for (const id of sellerIdList) {
    await delay(4*1000)
    const res = await fetch(`https://gxpt.jd.com/vender/channel/manage/shop_info?venderId=${id}`, {
      //@ts-ignore
      credentials: 'include',
      headers: {
        Cookie,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:103.0) Gecko/20100101 Firefox/103.0',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,en-US;q=0.7,en;q=0.3',
        'X-Requested-With': 'XMLHttpRequest',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache',
      },
      referrer: 'https://gxpt.jd.com/vender/channelCenter/reviewPurchase.htm?applyId=undefined&sellerId=12420367',
      method: 'GET',
      mode: 'cors',
    });
    const data = (await res.json()) as Info;
    if (!data.data) {
      console.log('break at', page);
      return;
    }
    console.log(page, 'page');
    writeFile('./data/jd.csv', data.data);
  }
}

async function getAll() {
  const res = await fetch('https://gxpt.jd.com/vender/channelCenter/findPurchaser', {
    // @ts-ignore
    credentials: 'include',
    headers: {
      Cookie,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:103.0) Gecko/20100101 Firefox/103.0',
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'zh-CN,en-US;q=0.7,en;q=0.3',
      'Content-Type': 'application/x-www-form-urlencoded',
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
    },
    referrer: 'https://gxpt.jd.com/vender/channelCenter/dxRecruit.htm?menuId=73496005',
    body: `sellerId=&shopName=&companyName=&cgIdOne=&cgIdTwo=&cgIdThree=&index=1&pageSize=10&sellerPin=`,
    method: 'POST',
    mode: 'cors',
  });
  const beginPage = Math.floor(readFile('./data/jd.csv').length / 10);
  const data = (await res.json()) as TableData;
  const totalPage = data.data.totalItem / 10;
  for (const page of range(beginPage + 1, totalPage + 1)) {
    await get(page);
  }
}

getAll();
