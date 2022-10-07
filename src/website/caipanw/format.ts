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

(async () => {
  const sourceDataList = (await readCsv('./data/test2.csv')) as { title: string; info: string; content: string }[];
  // 序号	年份	省	市	区/县	法院层级	法院名称	主要案由类别1	具体案由1	主要案由类别2	具体案由2	主要案由类别3	具体案由3	一审文书编号	二审文书编号（如有）	再审文书编号（如有）	判决刑罚（最高）	罚金金额（如有则计算罚金总额，单位：元）	涉案金额(单位：元）	是否跨境	流入跨境金额（换算成人民币，单位：元）
  for (const data of sourceDataList) {
    const no = '';
    const year = data.info.match(/案[\s]*号（([0-9]+)）/)?.[1] || '';
    const province = data.content.match(/[\S]+省/)?.[0] || '';
    const city = data.content.match(/省([\S]{1,6}市)/)?.[1] || '';
    let county = data.content.match(/[省市]([\S]{1,10}县)/)?.[1] || '';
    const court = data.content.match(/[\S]+人民法院/)?.[0];
    const cause = data.info.match(/案[\s]*由([\S\s]+)案/)?.[1] || '';
    const causeNo = data.info.match(/案[\s]*号([\S]+号)/)?.[1] || '';
    if (!county) {
      county = data.content.match(/[省市][\S]+区/)?.[1] || '';
    }
    // console.log({ no, year, province, city, county, court, cause, causeNo, ...data });
    await writeCsv('./data/tFor_2022_09_28_2.csv', [{ no, year, province, city, county, court, cause, causeNo, content:data.content.replace(/[\r\n]+/g, ' ') }])
  }
})();
