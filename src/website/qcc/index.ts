// import { send } from '@/server';
import { createPage } from '@/server/puppeteer';
import { exec } from '@/server/message';
import { ExecFuncParams } from '@/browser/executor/type';
import { range } from 'ramda';
import { writeFile, readFile } from '@/fs';
import { delay } from '@/utils';
import { useCallback } from '@/server';

const idList: string[] = readFile('./data/qcc.csv').map((d) => d[0]);

// 开始

useCallback(async () => {
  for (const id of idList) {
    const ws1 = await createPage(`https://www.qcc.com/web/search/trademark?key=${id}&type=shangbiao&sbSearchType=1`);
    // await exec(
    //   ws,
    //   ({ R, delay }, id) => {
    //     window.open();
    //   },
    //   id
    // );
    await delay(2 * 60 * 1000);
  }
});

// useCallBack(async ({ ws, message }) => {
//   if (message.content.url === 'https://www.qcc.com/') {
//     setInterval(() => {
//       exec(ws, ()=>console.log(123))
//     }, 1000)
//     for (const id of idList) {
//       _id = id;
//       await exec(
//         ws,
//         ({ R, delay }, id) => {
//           window.open(`https://www.qcc.com/web/search/trademark?key=${id}&type=shangbiao&sbSearchType=1`);
//         },
//         id
//       );
//       await delay(2 * 60 * 1000);
//     }
//   }
//   // console.log(message);
// });

// useCallBack(async ({ ws, message }) => {
//   if (message.content.url.includes('https://www.qcc.com/web/search/trademark')) {
//     exec(ws, async ({ delay }) => {
//       while (true) {
//         await delay(1000);
//         const linkElem = document.querySelector('a.title') as HTMLLinkElement;
//         if (linkElem) {
//           setImmediate(() => {
//             linkElem.click();
//           });
//           setTimeout(() => {
//             window.close();
//           }, 1000);
//           return;
//         }
//       }
//     });
//   }
//   // data.data
// });
// useCallBack(async ({ ws, message }) => {
//   if (message.content.url.includes('https://www.qcc.com/brandDetail')) {
//     const brandDetail = await exec(ws, () => {
//       const detail = [...document.querySelectorAll('.tb')]
//         .filter((e) => {
//           return (
//             e.textContent?.includes('申请人名称(中文)') ||
//             e.textContent?.includes('申请人地址(中文)') ||
//             e.textContent?.includes('国际分类') ||
//             e.textContent?.includes('商标名称')
//           );
//         })
//         .map((e) => {
//           const label = e.textContent;
//           const value = e.nextElementSibling?.textContent || '';
//           return { label, value };
//         });
//       return detail;
//     });
//     await exec(
//       ws,
//       ({}, brandDetail) => {
//         const address = brandDetail.find((d) => d.label === '申请人地址(中文)')?.value || '';
//         const name = brandDetail.find((d) => d.label === '申请人名称(中文)')?.value || '';
//         const ca = brandDetail.find((d) => d.label === '国际分类')?.value || '';
//         const brandName = brandDetail.find((d) => d.label === '商标名称')?.value || '';
//         setTimeout(() => {
//           window.close();
//         }, 1000);
//         window.open(
//           `https://www.qcc.com/web/search?key=${encodeURIComponent(name)}&pos=${encodeURIComponent(address)}&cate=${encodeURIComponent(
//             ca
//           )}&bName=${encodeURIComponent(brandName)}`
//         );
//       },
//       brandDetail
//     );
//   }
//   // data.data
// });
// useCallBack(async ({ ws, message }) => {
//   if (message.content.url.includes('https://www.qcc.com/web/search') && !message.content.url.includes('trademark')) {
//     const resData = await exec(
//       ws,
//       async ({ R, delay }, id) => {
//         const searchParams = new URL(location.href).searchParams;
//         const address = searchParams.get('pos') || '';
//         const name = searchParams.get('key') || '';
//         const cate = searchParams.get('cate') || '';
//         const bName = searchParams.get('bName') || '';
//         for (const index of R.range(0, 3)) {
//           await delay(1000);
//           let hasCateClick = false;
//           for (const e of [...document.querySelectorAll('a.pills-item')]) {
//             const originElemText = e.textContent || '@';
//             if (true) {
//               const elemText = originElemText.replace(/\([0-9]*\)/g, '').replace(/[\s]*/g, '');
//               if (cate.includes('餐饮') && elemText.includes('住宿和餐饮业') && !hasCateClick) {
//                 (e as HTMLLinkElement).click();
//                 hasCateClick = true;
//                 await delay(3000);
//               }
//               if (address.includes(elemText)) {
//                 (e as HTMLLinkElement).click();
//                 await delay(3000);
//                 break;
//               }
//             }
//           }
//         }
//         let legalCellDomList: Element | Element[] | undefined = void 0;
//         const cellDomList = [...document.querySelectorAll('.search-cell table tr')];
//         const filteredCellDomList = cellDomList.filter((_cellDom) => {
//           const title = _cellDom.querySelector('.title.copy-value')?.textContent || '';
//           return bName
//             .split(' ')
//             .filter((d) => d)
//             .some((b) => title.includes(b));
//         });
//         if (filteredCellDomList.length) {
//           legalCellDomList = filteredCellDomList.filter((_cellDom) => {
//             const isSurvival = !!_cellDom.querySelector('.copy-title .nstatus.text-success');
//             const isPhoneDanger = !!_cellDom?.querySelector?.('.phone-status-icon.danger');
//             return isSurvival && !isPhoneDanger;
//           });
//         } else {
//           legalCellDomList = cellDomList.filter((_cellDom) => {
//             const isSurvival = !!_cellDom.querySelector('.copy-title .nstatus.text-success');
//             const isPhoneDanger = !!_cellDom?.querySelector?.('.phone-status-icon.danger');
//             return isSurvival && !isPhoneDanger;
//           });
//         }
//         if (!legalCellDomList.length) {
//           setTimeout(() => {
//             window.close();
//           }, 2000);
//           return;
//         }
//         const reList = legalCellDomList
//           .filter((d) => d)
//           .map((_cellDom: Element) => {
//             let phone = '';
//             let title = _cellDom.querySelector('.title.copy-value')?.textContent?.replace(/[\s]/g, '') || '';
//             let shopAddress = _cellDom.querySelector('.copy-value.address-map')?.textContent?.replace(/[\s]/g, '') || '';
//             for (const trDom of [..._cellDom.querySelectorAll('tr .f')]) {
//               if (trDom.textContent?.includes('电话')) {
//                 phone = trDom.textContent.replace(/[\s]/g, '');
//               }
//             }
//             phone = phone.replace(/更多[0-9]*/g, '');
//             return { name, phone, id, bName, title, address, shopAddress };
//           }).filter(e => !e.phone.startsWith('电话：-'))
//         setTimeout(() => {
//           window.close();
//         }, 2000);
//         return reList;
//       },
//       _id
//     );
//     console.log(resData, 'resData');
//     writeFile('./data/qcco.csv', resData);
//   }
//   // data.data
// });
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
