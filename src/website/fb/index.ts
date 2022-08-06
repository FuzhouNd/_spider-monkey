import { useCallback, exec, createPage, store } from '@/server';
import { delay } from '@/utils';
import { writeCsv } from '@/fs';

useCallback(async () => {
  const ws = await createPage('https://www.facebook.com/groups/needlefelting/members/pages');
  let allUrlList: string[] = [];
  await delay(30 * 1000);
  while (true) {
    const urlList = await exec(ws.ws, async ({ delay }) => {
      const htmlDom = window.document.querySelector('html');
      if (htmlDom) {
        htmlDom.scrollBy(0, 99999999);
      }
      await delay(3 * 1000);
      const urlList = [...document.querySelectorAll('span > a')]
        .map((d) => d.getAttribute('href') || '')
        .filter((href) => {
          // /groups/186120998105425/user/476493949039411/
          if (href.includes('groups') && href.includes('user')) {
            return true;
          }
        });
      return urlList;
    });
    const l = allUrlList.length;
    allUrlList = [...new Set([...allUrlList, ...urlList]).values()];
    if (allUrlList.length === l) {
      break;
    }
  }
  // console.log(allUrlList);
  let emailList = [];
  for (const url of allUrlList) {
    await createPage(`https://www.facebook.com${url}`, { noWait: true });
    const ws = await store.waitForAdd();
    await delay(30 * 1000);
    if (ws) {
      const email = await exec(ws.ws, () => {
        return (
          [...document.querySelectorAll('span > a')]
            .map((d) => {
              console.log(d.textContent || '');
              return d.textContent || '';
            })
            .find((d) => /[\S]+@[\S]+/g.test(d)) || ''
        );
      });
      console.log();
      // emailList.push({ email, url });
      await writeCsv(
        './data/userUrl.csv',
        [{ email, url }]
      );
    }
  }
  // console.log(emailList);
  // console.log(allUrlList);
});
