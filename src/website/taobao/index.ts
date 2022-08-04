import { useCallback } from '@/server';
import { exec } from '@/server/message';
import { createPage } from '@/server/puppeteer';
import { getAllWs, removeWs } from '@/server/wsStore';
import { delay } from '@/utils';
import { writeCsv } from '@/fs';

const goodUrlList = [
  'https://detail.tmall.com/item.htm?id=657565643973',
  'https://detail.tmall.com/item.htm?id=671227090017',
  'https://detail.tmall.com/item.htm?id=652883475332',
];

useCallback(async () => {
  for (const url of goodUrlList) {
    const ws = await createPage(url);
    await exec(ws.ws, async ({ delay }) => {
      for (const d of [...document.querySelectorAll('.tb-sku dl.tb-prop.tm-sale-prop')]) {
        const link = d.querySelector('a');
        if (link) {
          link.click();
          await delay(1000);
        }
      }
    });
    await delay(2000);
    await exec(ws.ws, () => {
      const buyBtn = document.querySelector('#J_LinkBuy') as HTMLButtonElement;
      if (buyBtn) {
        buyBtn.click();
      }
    });
    await delay(3000);
    const fWs = getAllWs().find((w) => w.url.includes('https://buy.tmall.com/order/confirm_order'));
    if (fWs) {
      const price = await exec(fWs.ws, () => {
        const priceDom = document.querySelector('.realpay--price') as HTMLDivElement;
        setTimeout(() => {
          window.close();
        }, 2000);
        if (priceDom) {
          return priceDom.textContent || '';
        }
      });
      removeWs(fWs.id);
      writeCsv('./data/price.csv', [{ url, price }]);
      console.log(price, 'price');
    }
  }
});
