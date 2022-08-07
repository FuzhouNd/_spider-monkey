import { useCallback } from '@/server/utils/server';
import { exec } from '@/server/utils/message';
import { createPage } from '@/server/utils/puppeteer';
import { getAllWs, getWsById, removeWs, waitForWs } from '@/server/utils/wsStore';
import { delay } from '@/utils';
import { writeCsv, readCsv } from '@/fs';
import dayjs from 'dayjs';

useCallback(async () => {
  const goodUrlList = (await readCsv<string[]>('./data/taoBaoData.csv', { headers: false })).map((d) => d[0]);
  const existUrlList = (await readCsv<{ url: string }>('./data/price.csv')).map((d) => d.url);
  for (const url of goodUrlList) {
    if (existUrlList.includes(url)) {
      console.log('exist', url);
      continue;
    }
    const ws = await createPage(url);
    await delay(3000);
    const title = await exec(ws.ws, () => {
      return (document.querySelector('.tb-detail-hd')?.textContent || '').replace(/[\s]*/g, '');
    });
    const sale = await exec(ws.ws, () => {
      return (document.querySelector('.tm-ind-sellCount .tm-indcon')?.textContent || '').replace(/[^0-9]/g, '');
    });
    const imgSrc =
      (
        await exec(ws.ws, () => {
          return (document.querySelector('#J_ImgBooth') as HTMLImageElement)?.src || '';
        })
      ).split('.jpg')[0] + '.jpg';
    const canBuy = await exec(ws.ws, () => {
      const buyDom = document.querySelector('#J_LinkBuy');
      if (buyDom && buyDom.parentElement) {
        return !buyDom.parentElement.classList.contains('tb-hidden');
      }
      return false;
    });
    if (!canBuy) {
      await exec(ws.ws,()=>{
        setTimeout(() => {
          window.close()
        }, 2000);
      })
      writeCsv('./data/price.csv', [{ date: dayjs().format('YYYY-MM-DD HH:mm:ss'), title, url, price: 0, sale, imgSrc }]);
      console.log('title', title, url, '暂时不能购买');
      continue;
    }
    await exec(ws.ws, async ({ delay, R }) => {
      // .tm-promo-price .tm-price
      let propsList = [...document.querySelectorAll('.tb-sku dl.tb-prop.tm-sale-prop')];
      const liListList = propsList.map((propsDom) => {
        return [...propsDom.querySelectorAll('li')] as HTMLLIElement[];
      });
      const total = liListList.reduce((re, cur) => {
        return re * cur.length;
      }, 1);
      const tArr = [];
      const stepArr = liListList.reduce(
        (re, cur) => {
          return [...re, re.slice(-1)[0] * cur.length];
        },
        [1] as number[]
      );
      for (let i = 0; i < total; i++) {
        const t = R.range(0, liListList.length).map((index) => {
          return Math.floor((i / stepArr[index]) % liListList[index].length);
        });
        tArr.push(t);
      }
      let minPrice = 99999999999;
      let minT: number[] = [];
      for (const t of tArr) {
        const propsList = [...document.querySelectorAll('.tb-sku dl.tb-prop.tm-sale-prop')];
        for (let index = 0; index < propsList.length; index++) {
          const propsDom = propsList[index];
          const liList = [...propsDom.querySelectorAll('li')] as HTMLLIElement[];
          const li = liList[t[index]];
          if (!li.classList.contains('tb-selected')) {
            li.querySelector('a')?.click?.();
          }
          await delay(1000);
        }
        const _minPrice = Math.min(...[...document.querySelectorAll('.tm-price')].map((d) => parseFloat(d.textContent || '99999999999')));
        if (_minPrice < minPrice) {
          minPrice = _minPrice;
          minT = t;
        }
      }
      propsList = [...document.querySelectorAll('.tb-sku dl.tb-prop.tm-sale-prop')];
      for (let index = 0; index < propsList.length; index++) {
        const propsDom = propsList[index];
        const liList = [...propsDom.querySelectorAll('li')] as HTMLLIElement[];
        const li = liList[minT[index]];
        if (!li.classList.contains('tb-selected')) {
          li.querySelector('a')?.click?.();
        }
        await delay(1000);
      }
    });
    await exec(ws.ws, () => {
      const buyBtn = document.querySelector('#J_LinkBuy') as HTMLButtonElement;
      if (buyBtn) {
        buyBtn.click();
      }
    });
    await delay(2000);
    const fWs = getWsById(ws.id) ? ws : await waitForWs((w) => w.url.includes('https://buy.tmall.com/order/confirm_order'));
    await delay(1000);
    // console.log(getAllWs(), fWs);
    if (!fWs) {
      console.log('fail', title, url);
    }
    if (fWs) {
      const price = await exec(fWs.ws, () => {
        setTimeout(() => {
          window.close();
        }, 2000);
        const priceDom = document.querySelector('.realpay--price') as HTMLDivElement;
        setTimeout(() => {
          window.close();
        }, 2000);
        if (priceDom) {
          return priceDom.textContent || '';
        }
        return '';
      });
      removeWs(fWs.id);
      writeCsv('./data/price.csv', [{ date: dayjs().format('YYYY-MM-DD HH:mm:ss'), title, url, price, sale, imgSrc }]);
      console.log('title', title, url, price);
    }
  }
  console.log('爬取结束');
});
