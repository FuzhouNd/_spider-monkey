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
  'https://detail.tmall.com/item.htm?id=614624098327',
  'https://detail.tmall.com/item.htm?id=673989143601',
  'https://detail.tmall.com/item.htm?id=668502670342',
  'https://detail.tmall.com/item.htm?id=673192491096',
  'https://detail.tmall.com/item.htm?id=608521032939',
  'https://detail.tmall.com/item.htm?id=616472909151',
  'https://detail.tmall.com/item.htm?id=618046881022',
  'https://detail.tmall.com/item.htm?id=654905950999',
  'https://detail.tmall.com/item.htm?id=660494576505',
  'https://detail.tmall.com/item.htm?id=641871915466',
  'https://detail.tmall.com/item.htm?id=669217539402',
  'https://detail.tmall.com/item.htm?id=645182638741',
  'https://detail.tmall.com/item.htm?id=640830237044',
  'https://detail.tmall.com/item.htm?id=598732299152',
  'https://detail.tmall.com/item.htm?id=567256065770',
  'https://detail.tmall.com/item.htm?id=652827603232',
  'https://detail.tmall.com/item.htm?id=627428116633',
  'https://detail.tmall.com/item.htm?id=677165555235',
  'https://detail.tmall.com/item.htm?id=625303954056',
  'https://detail.tmall.com/item.htm?id=670796920189',
  'https://detail.tmall.com/item.htm?id=564112609064',
  'https://detail.tmall.com/item.htm?id=670568960294',
];

useCallback(async () => {
  for (const url of goodUrlList) {
    const ws = await createPage(url);
    await exec(ws.ws, () => {
      for (const d of [...document.querySelectorAll('.tb-sku dl.tb-prop.tm-sale-prop')]) {
        const link = d.querySelector('a');
        if (link) {
          link.click();
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
        if (priceDom) {
          setTimeout(() => {
            window.close();
          }, 2000);
          return priceDom.textContent || '';
        }
      });
      removeWs(fWs.id);
      writeCsv('./data/price.csv', [{ url, price }]);
      console.log(price, 'price');
    }
  }
});
