// import { send } from '@/server';
import { useCallBack } from '@/server/index';
import { exec } from '@/server/message';
import { ExecFuncParams } from '@/browser/executor/type';
import { range } from 'ramda';
import { writeFile, readFile } from '@/fs';
import { delay } from '@/utils';

const idList: string[] = readFile('./data/qcc.csv').map((d) => d[0]);

// 开始
let _id = '';
useCallBack(async ({ ws, message }) => {
  if (message.content.url === 'https://www.qcc.com/') {
    for (const id of idList) {
      _id = id;
      await exec(
        ws,
        ({ R, delay }, id) => {
          window.open(`https://www.qcc.com/web/search/trademark?key=${id}&type=shangbiao&sbSearchType=1`);
        },
        id
      );
      await delay(5 * 60 * 1000);
    }
  }
  // console.log(message);
});

useCallBack(async ({ ws, message }) => {
  if (message.content.url.includes('https://www.qcc.com/web/search/trademark')) {
    exec(ws, async ({ delay }) => {
      while (true) {
        await delay(1000);
        const linkElem = document.querySelector('a.title') as HTMLLinkElement;
        if (linkElem) {
          setImmediate(() => {
            linkElem.click();
          });
          setTimeout(() => {
            window.close();
          }, 1000);
          return;
        }
      }
    });
  }
  // data.data
});
useCallBack(async ({ ws, message }) => {
  if (message.content.url.includes('https://www.qcc.com/brandDetail')) {
    const brandDetail = await exec(ws, () => {
      const detail = [...document.querySelectorAll('.tb')]
        .filter((e) => {
          return (
            e.textContent?.includes('申请人名称(中文)') ||
            e.textContent?.includes('申请人地址(中文)') ||
            e.textContent?.includes('国际分类')
          );
        })
        .map((e) => {
          const label = e.textContent;
          const value = e.nextElementSibling?.textContent || '';
          return { label, value };
        });
      return detail;
    });
    await exec(
      ws,
      ({}, brandDetail) => {
        const address = brandDetail.find((d) => d.label === '申请人地址(中文)')?.value || '';
        const name = brandDetail.find((d) => d.label === '申请人名称(中文)')?.value || '';
        const ca = brandDetail.find((d) => d.label === '国际分类')?.value || '';
        setTimeout(() => {
          window.close();
        }, 1000);
        window.open(`https://www.qcc.com/web/search?key=${encodeURIComponent(name)}&pos=${encodeURIComponent(address)}&cate=${ca}`);
      },
      brandDetail
    );
  }
  // data.data
});
useCallBack(async ({ ws, message }) => {
  if (message.content.url.includes('https://www.qcc.com/web/search')) {
    const resData = await exec(ws, async ({ R, delay }) => {
      const searchParams = new URL(location.href).searchParams;
      const address = searchParams.get('pos') || '';
      const cate = searchParams.get('cate') || '';
      for (const index of R.range(0, 3)) {
        await delay(1000);
        for (const e of [...document.querySelectorAll('a.pills-item')]) {
          const elemText = (e.textContent || '@').replace(/\([0-9]*\)/g, '').replace(/[\s]*/g, '');
          console.log(elemText, address, address.includes(elemText));
          if (address.includes(elemText)) {
            (e as HTMLLinkElement).click();
            await delay(3000);
          }
          if (cate.includes('餐饮') && elemText.includes('住宿和餐饮业')) {
            (e as HTMLLinkElement).click();
            await delay(3000);
          }
        }
      }
      const cellDom = document.querySelector('.search-cell');
      if (cellDom) {
        let phone = '';
        let title = cellDom.querySelector('.title.copy-value')?.textContent?.replace(/[\s]/g, '') || '';
        for (const trDom of [...cellDom.querySelectorAll('tr .f')]) {
          if (trDom.textContent?.includes('电话')) {
            phone = trDom.textContent.replace(/[\s]/g, '');
          }
        }
        setTimeout(() => {
          window.close();
        }, 1000);
        return { phone, title, id: _id };
      }
    });
    console.log(resData, 'resData');
    writeFile('./data/qcco.csv', resData);
  }
  // data.data
});
// useCallBack(async ({ ws, message }) => {
//   if (message.content.url.includes('https://mobile.yangkeduo.com/goods.html')) {
//     const func = async ({ delay, R, data }: ExecFuncParams) => {
//       const price = document.querySelector('[data-uniqid="11"] [role="button"]')?.textContent || '';
//       const title = document.querySelector('.enable-select')?.textContent || '';
//       const name = document.querySelector('._1g9X2Rjz')?.textContent || '';
//       setTimeout(() => {
//         window.history.back();
//       }, 6000);
//       return { price, title, name };
//     };
//     const data = await exec(ws, func, imgUrlList);
//     writeFile('./data/pdd.csv', data)
//   }
// });
