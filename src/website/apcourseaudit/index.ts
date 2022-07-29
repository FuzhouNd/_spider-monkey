import fetch from 'node-fetch';
import fs from 'fs-extra';
import jsdom from 'jsdom';
import * as R from 'ramda';
import { deleteComma, deleteSemi } from '@/utils';
import { writeFile } from '@/fs';

const subjectList = [
  { sub: 'Chinese Language and Culture', v: 36 },
  { sub: 'English Language and Composition', v: 31 },
  { sub: 'French Language and Culture', v: 26 },
  { sub: 'German Language and Culture', v: 10 },
  { sub: 'Italian Language and Culture', v: 4 },
  { sub: 'Japanese Language and Culture', v: 37 },
  { sub: 'Spanish Language and Culture', v: 29 },
  { sub: 'Latin', v: 8 },
];

function getSchoolName(dom: Document) {
  return [...dom.querySelectorAll('p.cb-item-title')].map((d) => R.pipe(deleteComma, deleteSemi)(d.textContent || ''));
}

async function get(subId: number, subName = '') {
  const res = await fetch('https://apcourseaudit.inflexion.org/ledger/search.php', {
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded',
      pragma: 'no-cache',
      'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      // "cookie": "_ap-legacy=ar7n69pgu85i7d3c1ln83j82j1; _ga=GA1.2.632063984.1659054742; _gid=GA1.2.1124344149.1659054742",
      Referer: 'https://apcourseaudit.inflexion.org/ledger/search.php',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    body: `ledger_subject=${subId}&ledger_year=0&ledger_country=US&ledger_state=0&ledger_search=&order_id=0`,
    method: 'POST',
  });
  const text = await res.text();
  const dom = new jsdom.JSDOM(text);
  const pageList = [...dom.window.document.querySelectorAll('.pagination li a')]
    .map((a) => {
      return (a as HTMLLinkElement)?.href || '';
    })
    .filter((d) => d)
    .map((d) => new URL(d, 'http://www.a.com').searchParams.get('p'))
    .filter((d) => d)
    .map((d) => parseInt(d as string, 10));
  const schoolList = getSchoolName(dom.window.document);
  schoolList.forEach((sc) => {
    writeFile('./data/sc.csv', `${subId};${subName};${sc}`);
  })
  const totalPage = Math.max(...pageList);
  console.log(subName, 1, totalPage);
  for (const page of R.range(2, totalPage + 1)) {
    const res = await fetch(`https://apcourseaudit.inflexion.org/ledger/search.php?p=${page}`, {
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'zh-CN,zh;q=0.9',
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded',
        pragma: 'no-cache',
        'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        // "cookie": "_ap-legacy=ar7n69pgu85i7d3c1ln83j82j1; _ga=GA1.2.632063984.1659054742; _gid=GA1.2.1124344149.1659054742",
        Referer: 'https://apcourseaudit.inflexion.org/ledger/search.php',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: `ledger_subject=${subId}&ledger_year=0&ledger_country=US&ledger_state=0&ledger_search=&order_id=0`,
      method: 'POST',
    });
    const text = await res.text();
    const dom = new jsdom.JSDOM(text);
    const schoolList = getSchoolName(dom.window.document);
    if(!schoolList.length){
      console.log('break', subName, page);
      break
    }
    schoolList.forEach((sc) => {
      writeFile('./data/sc.csv', `${subId};${subName};${sc}`);
    })
    console.log(subName, page, totalPage);
  }
}

(async () => {
  for (const { sub, v } of subjectList.slice(1)) {
    await get(v, sub);
  }
})();
