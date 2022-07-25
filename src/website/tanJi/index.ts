import fetch from 'node-fetch';
import { Detail, Concat, List } from './type';
import R from 'ramda';
import fs from 'fs-extra';
import { delay } from '@/utils/index';
import { writeFile, readFile } from '@/fs/index';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const Cookie =
  'accountCenterSessionId=.eJwlzkFLxDAQhuH_krOHJJOkmZ7XBcUqC-LSXsokM7HWpULbdXHF_27Rw3d4Lx_Pt1reWNWqe767Pu0Outu9rs2xMe2X1o9je3k47sdmvF0be__eXg-uHfdjN74M6kb1ZZZlUPU6n2Wrv5sq58iFPRALR1uiC6LZICCElIymRDb7QhYjR6ODJhMBPFgNjKHaRpUmzhU6MTlL9mgde6qQYwUBgBxaEoySnKCRjCVEAo8phAgmb6w80DTJacNcJG09iXC_0Kf060fPSdWFTssGPi8y_6OD5ZxMAM6Ezhj2mqwpJaqfX23PVZU.Fb5DFg.IjImWjRE8ogq8E_n7uvbpdIqLVM; SecurityCenterDuId=IllxeWQvOXlwUVdFcmo5MGtGbGhSQjBJPSI.Fb5C4w.qcE93hS3AoXoG0Yz2P6u_s8O7ZM; _co_i=6194a7b46eceb968e3767c27; __last_enter_version=sales; Hm_lvt_f2ee75449fc055cc4dbceb4fe403bea3=1658539547; Hm_lpvt_f2ee75449fc055cc4dbceb4fe403bea3=1658630551; DISTINCT_ID=f97740ad-38bd-4625-884f-b19d1af42490; tg_referrer_source=https%3A%2F%2Fuser.tungee.com%2F; acw_tc=781bad2f16586298229352764e7e5d373026e53590fd81d01a809b53937960';

async function getComponyList(page: number) {
  const inP = (page - 1) * 50;
  const endP = page * 50;
  const res = await fetch(`https://sales.tungee.com/api/unlock-leads?sort_field=create_time&sort=-1&begin=${inP}&end=${endP}`, {
    // @ts-ignore
    credentials: 'include',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:103.0) Gecko/20100101 Firefox/103.0',
      Accept: '*/*',
      'Accept-Language': 'zh-CN,en-US;q=0.7,en;q=0.3',
      pragma: 'no-cache',
      Cookie,
      'cache-control': 'no-cache',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
    },
    referrer: 'https://sales.tungee.com/unlock-list/enterprise',
    method: 'GET',
    mode: 'cors',
  });
  const data = (await res.json()) as List;
  return data.leads.map((l) => ({ id: l.enterprise_id, name: l.enterprise_name }));
}

// getComponyList()

async function getCompanyDetail(id: string) {
  const res = await fetch(`https://sales.tungee.com/api/enterprise/info/detail?enterprise_id=${id}`, {
    // @ts-ignore
    credentials: 'include',
    headers: {
      Cookie,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:103.0) Gecko/20100101 Firefox/103.0',
      Accept: '*/*',
      'Accept-Language': 'zh-CN,en-US;q=0.7,en;q=0.3',
      pragma: 'no-cache',
      'cache-control': 'no-cache',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
    },
    referrer: `https://sales.tungee.com/enterprise-details/${id}/enterprise-information/basic-information`,
    method: 'GET',
    mode: 'cors',
  });
  const data = (await res.json()) as Detail;
  const name = data.name;
  const legalRepresentative = data.legalRepresentative;
  const res2 = await fetch(`https://sales.tungee.com/api/lead/contacts?enterprise_id=${id}&type=company`, {
    // @ts-ignore
    credentials: 'include',
    headers: {
      Cookie,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:103.0) Gecko/20100101 Firefox/103.0',
      Accept: '*/*',
      'Accept-Language': 'zh-CN,en-US;q=0.7,en;q=0.3',
      pragma: 'no-cache',
      'cache-control': 'no-cache',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
    },
    referrer: 'https://sales.tungee.com/enterprise-details/37622fd1db053af8/contacts',
    method: 'GET',
    mode: 'cors',
  });
  const data2 = (await res2.json()) as Concat;
  const contactList = data2.contacts.map((e) => ({
    name: e.contactName || '无',
    phone: e.contact_label,
    desc: e.duplicateFamilyName || '',
  }));
  return {
    id,
    name,
    legalRepresentative,
    importContact: contactList.filter((c) => c.desc?.includes('法人')).map((d) => `${d.name} ${d.phone}`).join(','),
    contact: contactList.map((d) => `${d.name} ${d.phone}`).join(','),
  };
}

const argv = yargs(hideBin(process.argv))
  .command(
    'list [total]',
    '生成公司列表',
    {
      total: {
        describe: '获取数量',
        demandOption: true,
      },
    },
    async (argv) => {
      if (!argv?.total) {
        console.log('需要total 参数');
      }
      const total = Math.floor(parseInt((argv.total as string) || '1', 10) / 50);
      for (const page of R.range(1, total + 1)) {
        const lList = await getComponyList(page);
        console.log(page);
        lList.forEach((l) => {
          fs.writeFileSync('./data/co.csv', `${l.id};${l.name}\r\n`, { flag: 'a' });
        });
        await delay();
      }
    }
  )
  .command(
    'detail',
    '获取公司详情',
    () => {},
    async () => {
      let idList: string[] = [];
      if (fs.pathExistsSync('./data/de.csv')) {
        idList = readFile('./data/de.csv').map((e) => e[0]);
      }
      for (const [id] of readFile('./data/co.csv')) {
        if (idList.includes(id)) {
          console.log(id, 'jump');
          continue;
        }
        const detail = await getCompanyDetail(id);
        console.log(id, 'get');
        writeFile('./data/de.csv', detail);
        await delay();
      }
    }
  )
  .help().argv;
