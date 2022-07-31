// 巨潮网

// `http://www.cninfo.com.cn/new/announcement/download?bulletinId=${bulletinId}&announceTime=${announceTime}`
import download from 'download';
import fs from 'fs-extra';
import { delay } from '@/utils/index';
import { toText } from '@/pdf/index';
import glob from 'glob';
import path from 'path';




async function downloadPdf(l: typeof list) {
  const tList = l.map((a) => {
    const bulletinId = (a.adjunctUrl || '').match(/([0-9A-Z]+)[.]PDF/)?.[1] || '';
    const announceTime = (a.adjunctUrl || '').match(/([0-9]+-[0-9]+-[0-9]+)/)?.[1] || '';
    return { bulletinId, announceTime, announcementTitle: a.announcementTitle, secName: a.secName };
  });
  for (const { bulletinId, announceTime, announcementTitle, secName } of tList) {
    const buf = await download(
      `http://www.cninfo.com.cn/new/announcement/download?bulletinId=${bulletinId}&announceTime=${announceTime}`,
    );
    console.log(announcementTitle);
    fs.writeFileSync(`./data/${secName}${announcementTitle}.pdf`, buf);
    await delay(5 * 1000);
  }
}

async function getKeyWordCount(filePath: string, _keyWords = keyWords) {
  const text = await toText(filePath);
  const list = _keyWords.map((k) => {
    const reg = new RegExp(`${k}`, 'g');
    const count = text.match(reg)?.length || 0;
    return { count, word: k };
  });
  return [...list, { count: text.replace(/[\s,，。；‘;']/g, '').length, word: 'total' }];
}

(async () => {
  
  // downloadPdf(
  //   list.filter((l) => {
  //     return !l.announcementTitle.includes('摘要') && !l.announcementTitle.includes('补充');
  //   })
  // );
})();
