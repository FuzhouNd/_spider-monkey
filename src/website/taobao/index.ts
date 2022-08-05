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
    const imgSrc = await exec(ws.ws, () => {
      return (document.querySelector('#J_ImgBooth') as HTMLImageElement)?.src || '';
    });
    await exec(ws.ws, async ({ delay }) => {
      // .tm-promo-price .tm-price
      const propsList = [...document.querySelectorAll('.tb-sku dl.tb-prop.tm-sale-prop')];
      const liListList = propsList.map((propsDom) => {
        return ([...propsDom.querySelectorAll('li:not(.tb-selected)')] as HTMLLIElement[]).filter(
          (l) => !l.classList.contains('tb-out-of-stock')
        );
      });
      liListList.reduce((re, liList, index) => {
        liList.map((li,index) => {
          return 
        })
      }, []);
      const selectIndex = new Array(propsList.length).fill(0);
      for (let index = 0; index < propsList.length; index++) {
        const d = propsList[index];
        // const liList =
        for (let _index = 0; _index < liList.length; _index++) {
          const li = liList[_index];
        }
      }
      // for (const d of ) {

      //   // const fl = liList.;
      //   if (fl) {
      //     fl.querySelector('a')?.click?.();
      //     await delay(500);
      //   }
      // }
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
