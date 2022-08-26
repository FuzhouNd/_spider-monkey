import fetch from 'node-fetch';
import fs from 'fs-extra';
import { JSDOM } from 'jsdom';
import dayjs from 'dayjs';
import { SearchData, DetailData, SearchData1 } from './type';
import { readCsv, writeCsv } from '@/fs';
import { delay } from '@/utils';
// import puppeteer from 'puppeteer-core';
import * as R from 'ramda';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
// add stealth plugin and use defaults (all evasion techniques)
puppeteer.use(StealthPlugin());

async function getAllZhouji() {
  const existDate = (await readCsv(`./data/hotel-${dayjs().format('YYYY-MM-DD')}.csv`))
    .filter((d: any) => d['所属集团'] === '洲际')
    .map((d: any) => d['日期']);
  for (let index = 0; index < 31; index++) {
    const fromDate = dayjs().add(index, 'day').format('YYYY-MM-DD');
    if (existDate.includes(fromDate)) {
      continue;
    }
    const toDate = dayjs()
      .add(index + 1, 'day')
      .format('YYYY-MM-DD');
    const body = {
      products: [
        {
          productCode: 'SR',
          guestCounts: [
            { otaCode: 'AQC10', count: 1 },
            { otaCode: 'AQC8', count: 0 },
          ],
          startDate: fromDate,
          endDate: toDate,
          quantity: 1,
        },
      ],
      radius: 30,
      distanceUnit: 'MI',
      distanceType: 'STRAIGHT_LINE',
      startDate: fromDate,
      endDate: toDate,
      geoLocation: [{ latitude: 36.0662299, longitude: 120.38299 }],
      rates: { ratePlanCodes: [] },
    };

    const res = await fetch('https://apis.ihg.com.cn/availability/v3/hotels/offers?fieldset=summary,summary.rateRanges', {
      headers: {
        accept: 'application/json, text/plain, */*',
        'content-type': 'application/json; charset=UTF-8',
        'ihg-language': 'en-US',
        'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'x-ihg-api-key': 'pQM1YazQwnWi5AWXmoRoA5FSfW0S9x8A',
        'x-ihg-sso-token':
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9FWkZRVUkxUlRWQ1FqRkJSRGd6UmtFNU1EYzBNVGhHTmtKRk5rUkJSamcyTVRSQlF6QTVOUSJ9.eyJpc3MiOiJodHRwczovL2ZpZG0uZ2lneWEuY29tL2p3dC80X2pwemFoTU80Q0JubDlFbG9wemZyMEEvIiwiYXBpS2V5IjoiNF9qcHphaE1PNENCbmw5RWxvcHpmcjBBIiwiaWF0IjoxNjU5OTY0NTEyLCJleHAiOjE2NTk5NjgxMTIsInN1YiI6IjJlZGRjNjZlLTk0YzctNDE1MC1iYjJhLTQ2MDk3Y2NhYThkZSIsImZpcnN0TmFtZSI6Inp4eCIsImRhdGEucmNNZW1iZXJzaGlwTnVtYmVyIjoiMTkzOTYwNTYyIiwiZGF0YS5tZW1iZXJLZXkiOjE1OTY4MjYwOTZ9.BnVz86hX6ZZVmcU1_rCH6s-PPNMGtjkffC6X3yFdEGBlNify5E2ftq8ijobI9tHtmvUGG2scaI_eaVVIJKveImqKLfiX3mH_3S7gKbQ3mSwi2t-MEuVfjQUoDj1gYrifBOsCrAkzCiz3ljVtGOxMeXlfNX7o-n039UcMd1N4KQ7r6fPgiRS4pAdDGHDG7nukoi9d8dRPedF3KHr03zr2BLTOt9R2EOtOPsjsmwYI1K3HYu-4Fc1qNw_Mv4AYu9YKtHccznJ0OlOTDG8743DnQ-A6i_Y-gRqKNBFYbH4NSRt_uJEyImIrMfFTRnl2zO7fjNmaySzWsIGuTjTAkonzLQ',
        Referer: 'https://www.ihg.com.cn/',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: JSON.stringify(body),
      method: 'POST',
    });
    const searchData = (await res.json()) as SearchData1;
    let allHotelDetail: any[] = [];
    for (const hotel of searchData.hotels) {
      const id = hotel.hotelMnemonic;
      const res = await fetch(
        `https://apis.ihg.com.cn/hotels/v1/profiles/${id}/details?fieldset=brandInfo,reviews,mediaCategories,location,tax,parking,facilities,profile,address,contact,renovationAlerts.active,stripes,policies,marketing`,
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json; charset=UTF-8',
            'ihg-language': 'zh-CN',
            'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'x-ihg-api-key': 'pQM1YazQwnWi5AWXmoRoA5FSfW0S9x8A',
            Referer: 'https://www.ihg.com.cn/',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
          },
          body: null,
          method: 'GET',
        }
      );
      const detailData = (await res.json()) as DetailData;
      const name = detailData.hotelInfo.profile.name;
      const body = {
        products: [
          {
            productCode: 'SR',
            guestCounts: [
              { otaCode: 'AQC10', count: 1 },
              { otaCode: 'AQC8', count: 0 },
            ],
            startDate: fromDate,
            endDate: toDate,
            quantity: 1,
          },
        ],
        startDate: fromDate,
        endDate: toDate,
        hotelMnemonics: [id],
        rates: { ratePlanCodes: [{ internal: 'IVANI' }] },
        options: { disabilityMode: 'ACCESSIBLE_AND_NON_ACCESSIBLE', returnAdditionalRatePlanDescriptions: true },
      };
      const res2 = await fetch(
        'https://apis.ihg.com.cn/availability/v3/hotels/offers?fieldset=rateDetails,rateDetails.policies,rateDetails.bonusRates,rateDetails.upsells',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json; charset=UTF-8',
            'ihg-language': 'zh-CN',
            'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'x-ihg-api-key': 'pQM1YazQwnWi5AWXmoRoA5FSfW0S9x8A',
            'x-ihg-sso-token':
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9FWkZRVUkxUlRWQ1FqRkJSRGd6UmtFNU1EYzBNVGhHTmtKRk5rUkJSamcyTVRSQlF6QTVOUSJ9.eyJpc3MiOiJodHRwczovL2ZpZG0uZ2lneWEuY29tL2p3dC80X2pwemFoTU80Q0JubDlFbG9wemZyMEEvIiwiYXBpS2V5IjoiNF9qcHphaE1PNENCbmw5RWxvcHpmcjBBIiwiaWF0IjoxNjU5OTY1NDQ3LCJleHAiOjE2NTk5NjU0NDgsInN1YiI6IjJlZGRjNjZlLTk0YzctNDE1MC1iYjJhLTQ2MDk3Y2NhYThkZSIsImZpcnN0TmFtZSI6Inp4eCIsImRhdGEucmNNZW1iZXJzaGlwTnVtYmVyIjoiMTkzOTYwNTYyIiwiZGF0YS5tZW1iZXJLZXkiOjE1OTY4MjYwOTZ9.gCgExjp_ssdMRBIP1aSkikfrL_BpzBTYSfSuWCV2IgOmITcajrKRmYO1dZ542qj37pBUWOXlaD0Z3DF5RxUyrcq8uIqUk2k7caGJgERrEhaI1c0TEZaxEGlcI0zNF2LqjvTci0fYOCrIRMPeiyobYGRrQlWs_E2qQatM7JYTpWAnG76d8k-9JevfD3W2sqdoWsAUm_7n_-QUiSK5C8PnakjcO7Hr-tf71WOLupGp4rX1mbWj-k1xavylq3CSjo5lmpV44Z40Zkp_kyelRh0g6txzkQN0LAcUNoQpvGCkV44FsFtf5z4qmwV1Xwx8ay5Ql6RWOEVuS6Yp01VWofELqw',
            Referer: 'https://www.ihg.com.cn/',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
          },
          body: JSON.stringify(body),
          method: 'POST',
        }
      );
      const searchData = (await res2.json()) as SearchData;
      if ((searchData as any).code) {
        console.log('房间已满', fromDate, name);
        continue;
      }
      // {} as {[key:string]:SearchData['hotels'][0]['productDefinitions']}
      const priceList = searchData.hotels
        .map((h) => {
          const ppList = h.rateDetails.offers.map((o) => {
            const code = o.productUses[0].inventoryTypeCode;
            const roomName = h.productDefinitions.find((d) => d.inventoryTypeCode === code)?.inventoryTypeName || '';
            const price = parseFloat(o.productUses[0].rates?.totalRate?.amountAfterTax || '0');
            return {
              日期: fromDate,
              所属集团: '洲际',
              酒店名称: name,
              保底房型: roomName,
              官网会员价: price.toFixed(2),
              我方报价: (price < 1000
                ? price * 0.95 + 20
                : price < 2000
                ? price * 0.95 + 10
                : price < 3000
                ? price * 0.95
                : price * 0.94
              ).toFixed(2),
            };
          });
          return R.pipe(
            R.groupBy((a: typeof ppList[0]) => `${a.官网会员价}`),
            R.toPairs,
            R.map((d) => (d[1] as any)[0])
          )(ppList);
        })
        .flat();
      allHotelDetail = allHotelDetail.concat(priceList);
      console.log('已获取酒店', fromDate, name);
    }
    writeCsv(`./data/hotel-${dayjs().format('YYYY-MM-DD')}.csv`, allHotelDetail);
    console.log('已获取完', fromDate, '洲际酒店');
    await delay(5 * 1000);
  }
}

async function getAllWanHao() {
  const bro = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    defaultViewport: { width: 1920, height: 1080 },
  });
  const existDate = (await readCsv(`./data/hotel-${dayjs().format('YYYY-MM-DD')}.csv`)).map((d: any) => d['日期']);
  const page = await bro.newPage();
  for (let index = 0; index < 31; index++) {
    const from = dayjs().add(index, 'day').startOf('day').valueOf();
    if (existDate.includes(dayjs(from).format('YYYY-MM-DD'))) {
      continue;
    }
    const to = dayjs()
      .add(index + 1, 'day')
      .startOf('day')
      .valueOf();
    await page.goto('https://www.marriott.com.cn/default.mi', { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(3000);
    const input = await page.$('#searchform_copy_destination > div.search_content > input');
    await input?.type('Qingdao, Shandong, China');
    const cal = await page.$('#searchform_copy-pc-calendar .cmp-searchfilters__field-input');
    await cal?.click?.();
    await page.waitForTimeout(1000);
    const fromB = await page.$(`#searchform_copy-pc-calendar .toMonth[time="${from}"] a`);
    const toB = await page.$(`#searchform_copy-pc-calendar .toMonth[time="${to}"] a`);
    await fromB?.click?.();
    await toB?.click?.();
    const sureB = await page.$(`#searchform_copy-pc-calendar .apply-btn`);
    await sureB?.click?.();
    await page.waitForTimeout(1000);
    const searchB = await page.$('#searchform_copy-cnsite-searchform .search_button');
    await searchB?.click?.();
    await page.waitForTimeout(1000);
    await page.waitForNavigation({ waitUntil: 'load' });
    await page.waitForTimeout(2000);
    const hrefList = await page.$$eval('.t-price-btn', (l) => l.map((d) => d.getAttribute('href')));
    let allDetailList: any[] = [];
    for (const href of hrefList) {
      const url = new URL(href || '', 'https://www.marriott.com.cn');
      url.searchParams.set('showFullPrice', 'true');
      const fullHref = url.toString();
      await page.goto(fullHref, { waitUntil: 'load', timeout: 60000 });
      const priceList = await page.$$eval('.room-rate-results', (l) => {
        return l.map((d) => {
          const name = d.querySelector('.l-display-none h3.l-margin-none')?.textContent || '';
          const price = d.querySelector('.not-cancellable .t-price > div')?.textContent || '';
          return { price: parseFloat(price.replace(/,/g, '')), name: name.replace(/\s/g, '') };
        });
      });
      const name = await page.$eval('[itemprop="name"]', (d) => d.textContent || '');
      const pplist = R.pipe(
        R.groupBy((a: { name: string; price: number }) => {
          return `${a.price}`;
        }),
        R.toPairs,
        R.map((d) => (d[1] as any[])[0])
      )(priceList);
      const detailList = pplist.map((p) => {
        const basePrice = p.price;
        return {
          日期: dayjs(from).format('YYYY-MM-DD'),
          所属集团: '万豪',
          酒店名称: name,
          保底房型: p.name,
          官网会员价: basePrice.toFixed(2),
          我方报价: (basePrice < 1000
            ? basePrice * 0.95 + 20
            : basePrice < 2000
            ? basePrice * 0.95 + 10
            : basePrice < 3000
            ? basePrice * 0.95
            : basePrice * 0.94
          ).toFixed(2),
        };
      });
      allDetailList = allDetailList.concat(detailList);
      console.log(name, dayjs(from).format('YYYY-MM-DD'), '万豪');
    }
    await writeCsv(`./data/hotel-${dayjs().format('YYYY-MM-DD')}.csv`, allDetailList);
    console.log('已获取完', dayjs(from).format('YYYY-MM-DD'), '万豪酒店');
  }
  await bro.close();
}

(async () => {
  await getAllWanHao();
  await getAllZhouji();
})();
