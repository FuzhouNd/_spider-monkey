import { useCallback } from '@/server';
import { exec } from '@/server/message';
import { createPage } from '@/server/puppeteer';
import { getAllWs, getWsById, removeWs, waitForWs } from '@/server/wsStore';
import { delay } from '@/utils';
import { writeCsv } from '@/fs';
import dayjs from 'dayjs';

const goodUrlList = [
  // 'https://detail.tmall.com/item.htm?id=671227090017',
  // 'https://detail.tmall.com/item.htm?id=652883475332',
  // 'https://detail.tmall.com/item.htm?id=614624098327',
  // 'https://detail.tmall.com/item.htm?id=673989143601',
  // 'https://detail.tmall.com/item.htm?id=668502670342',
  // 'https://detail.tmall.com/item.htm?id=673192491096',
  // 'https://detail.tmall.com/item.htm?id=608521032939',
  // 'https://detail.tmall.com/item.htm?id=616472909151',
  // 'https://detail.tmall.com/item.htm?id=618046881022',
  // 'https://detail.tmall.com/item.htm?id=654905950999',
  // 'https://detail.tmall.com/item.htm?id=660494576505',
  // 'https://detail.tmall.com/item.htm?id=641871915466',
  // 'https://detail.tmall.com/item.htm?id=669217539402',
  // 'https://detail.tmall.com/item.htm?id=645182638741',
  // 'https://detail.tmall.com/item.htm?id=640830237044',
  // 'https://detail.tmall.com/item.htm?id=598732299152',
  // 'https://detail.tmall.com/item.htm?id=567256065770',
  // 'https://detail.tmall.com/item.htm?id=652827603232',
  // 'https://detail.tmall.com/item.htm?id=627428116633',
  // 'https://detail.tmall.com/item.htm?id=677165555235',
  // 'https://detail.tmall.com/item.htm?id=625303954056',
  // 'https://detail.tmall.com/item.htm?id=670796920189',
  // 'https://detail.tmall.com/item.htm?id=564112609064',
  // 'https://detail.tmall.com/item.htm?id=670568960294',
  // 'https://detail.tmall.com/item.htm?id=618261233184',
  // 'https://detail.tmall.com/item.htm?id=674213901644',
  // 'https://detail.tmall.com/item.htm?id=639464789112',
  // 'https://detail.tmall.com/item.htm?id=670576731420',
  // 'https://detail.tmall.com/item.htm?id=549183943806',
  // 'https://detail.tmall.com/item.htm?id=654001218484',
  'https://detail.tmall.com/item.htm?id=650732546014',
  'https://detail.tmall.com/item.htm?id=674027393310',
  'https://detail.tmall.com/item.htm?id=619321051659',
  'https://detail.tmall.com/item.htm?id=617359218481',
  'https://detail.tmall.com/item.htm?id=604431557304',
];

useCallback(async () => {
  for (const url of goodUrlList) {
    const ws = await createPage(url);
    await delay(2000);
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
      for (const d of [...document.querySelectorAll('.tb-sku dl.tb-prop.tm-sale-prop')]) {
        const liList = [...d.querySelectorAll('li:not(.tb-selected)')] as HTMLLinkElement[];
        const fl = liList.find(l => !l.classList.contains('tb-out-of-stock'))
        if (fl) {
          fl.querySelector('a')?.click?.();
          await delay(500);
        }
      }
    });
    await exec(ws.ws, () => {
      const buyBtn = document.querySelector('#J_LinkBuy') as HTMLButtonElement;
      if (buyBtn) {
        buyBtn.click();
      }
    });
    await delay(1000);
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
      console.log(price, 'price');
    }
  }
});
