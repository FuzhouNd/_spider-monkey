import fetch from 'node-fetch';
import fs from 'fs-extra';
import path from 'path';
import { SearchResult, DetailTopResult } from './type';
import { writeFile, readFile } from '@/fs';

const Cookie = fs.readFileSync(path.resolve(__dirname, './cookie.txt'), { encoding: 'utf-8' });
const token = fs.readFileSync(path.resolve(__dirname, './token.txt'), { encoding: 'utf-8' });
const pid = fs.readFileSync(path.resolve(__dirname, './pid.txt'), { encoding: 'utf-8' });

async function getByCompanyName(name: string) {
  const searchBody = { data: { pageNum: 1, page: 1, pageSize: 10, sortType: 30, companyName: name, portalType: 'default' } };
  const res = await fetch('https://www.xiaoke.cn/api/zq/xkb/pc/search', {
    headers: {
      accept: '*/*',
      'accept-language': 'zh-CN,zh;q=0.9',
      accountid: '668661',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      pid: pid,
      pragma: 'no-cache',
      'sec-ch-ua': `".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"`,
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': `"Windows"`,
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      templateid: '',
      token: token,
      'weimob-pid': pid,
      'x-freeker-client': '3',
      'x-freeker-token': token,
      xkbversion: '0',
      Cookie,
      Referer: 'https://www.xiaoke.cn/xk/searvistor/find/bigsearh?',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    body: JSON.stringify(searchBody),
    method: 'POST',
  });
  const searchData = (await res.json()) as SearchResult;
  // console.log(searchData);
  const DPID = searchData?.data?.list?.[0]?.DPID;
  if (!DPID) {
    console.warn(name, '查不到');
    return;
  }
  const res2 = await fetch('https://www.xiaoke.cn/api/zq/xkb/pc/detailTop', {
    headers: {
      accept: '*/*',
      'accept-language': 'zh-CN,zh;q=0.9',
      accountid: '668661',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      pid: pid,
      pragma: 'no-cache',
      'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      templateid: '',
      token: token,
      'weimob-pid': pid,
      'x-freeker-client': '3',
      'x-freeker-token': token,
      xkbversion: '0',
      Cookie,
      Referer: 'https://www.xiaoke.cn/xk/searvistor/find/bigsearh?',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    body: `{"data":{"DPID":"${DPID}","contactEncrypt":0,"isReceived":0}}`,
    method: 'POST',
  });
  const res3 = await fetch('https://www.xiaoke.cn/api/zq/xkb/pc/detailTop', {
    headers: {
      accept: '*/*',
      'accept-language': 'zh-CN,zh;q=0.9',
      accountid: '668661',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      pid: pid,
      pragma: 'no-cache',
      'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      templateid: '',
      token: token,
      'weimob-pid': pid,
      'x-freeker-client': '3',
      'x-freeker-token': token,
      xkbversion: '1',
      Cookie,
      Referer: 'https://www.xiaoke.cn/xk/searvistor/find/bigsearh?',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    body: `{"data":{"DPID":"${DPID}","contactEncrypt":0,"isReceived":0}}`,
    method: 'POST',
  });
  const detail = (await res2.json()) as DetailTopResult;
  const detail3 = (await res3.json()) as DetailTopResult;
  const legalPerson = detail?.data?.baseInfo?.legalPerson || '';
  const contacts1 = detail?.data?.contacts?.cellPhones || [];
  const contacts2 = detail3?.data?.contacts?.cellPhones || [];
  const phoneList = ([...contacts1, ...contacts2] || []).map((d) => d.info);
  writeFile(path.resolve(__dirname, './data.csv'), { name, legalPerson, phone: "'" + phoneList.join(',') });
  console.log('已获取', name);
}

(async () => {
  if (!fs.pathExistsSync(path.resolve(__dirname, './company.csv'))) {
    console.log('需要填入公司名');
    return;
  }
  const companyNameList = readFile(path.resolve(__dirname, './company.csv')).map((d) => d[0]);
  let existCompanyNameList: string[] = [];
  if (fs.pathExistsSync(path.resolve(__dirname, './data.csv'))) {
    existCompanyNameList = readFile(path.resolve(__dirname, './data.csv')).map((d) => d[0]);
  }
  for (const name of companyNameList) {
    if (existCompanyNameList.includes(name)) {
      console.log(name, '已存在');
      continue;
    }
    await getByCompanyName(name);
  }
})();
