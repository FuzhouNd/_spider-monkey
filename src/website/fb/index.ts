import { useCallback, exec, createPage } from '@/server';
import { delay } from '@/utils';

useCallback(async () => {
  const ws = await createPage('https://www.facebook.com/groups/needlefelting/members/pages?key=123');
  await delay(5 * 1000);
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
  console.log(urlList);
});
