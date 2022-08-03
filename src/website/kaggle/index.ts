import fetch from 'node-fetch';
import { Detail, IdList } from './type';
import dayjs from 'dayjs';
import download from 'download';
import fs from 'fs-extra';
import glob from 'glob';
import {delay} from '@/utils';

async function getIdList(page: number) {
  const body = {
    sortBy: 'DATE_CREATED',
    pageSize: 100,
    group: 'EVERYONE',
    page: page,
    tagIds: '',
    excludeResultsFilesOutputs: false,
    wantOutputFiles: false,
  };
  const res = await fetch('https://www.kaggle.com/api/i/kernels.KernelsService/ListKernelIds', {
    headers: {
      accept: 'application/json',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      pragma: 'no-cache',
      'sec-ch-ua': `".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"`,
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': `"Windows"`,
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'x-xsrf-token': 'CfDJ8J3M_yAX7KFLocPnRStQF54zBE5ldMG-CA7Z3RxGr73yfBlHvZNvIykqjL0ZlRYLfGMjWHF12bzm3PP_QEqkcUoTAf2HRL3vSYpwR4a2ImZhDg',
      cookie:
        'ka_sessionid=e714cfaf04926f5de0114d976f1a3008; CSRF-TOKEN=CfDJ8J3M_yAX7KFLocPnRStQF54Ad1VFmNaFuHJ9-xNjMsxYB-SxNGF1JLnBgxDiS8H7O3Swwy15lRj9wT3Gaa-L43Cdrd8XgI8zqshIsCPNsg; XSRF-TOKEN=CfDJ8J3M_yAX7KFLocPnRStQF54zBE5ldMG-CA7Z3RxGr73yfBlHvZNvIykqjL0ZlRYLfGMjWHF12bzm3PP_QEqkcUoTAf2HRL3vSYpwR4a2ImZhDg; CLIENT-TOKEN=eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpc3MiOiJrYWdnbGUiLCJhdWQiOiJjbGllbnQiLCJzdWIiOm51bGwsIm5idCI6IjIwMjItMDgtMDNUMTE6MzM6MzEuNTQ5NTYzNFoiLCJpYXQiOiIyMDIyLTA4LTAzVDExOjMzOjMxLjU0OTU2MzRaIiwianRpIjoiODFjZTIwODEtYWMyZi00NWVhLThmMGUtODVhNGMwNWE3Njc5IiwiZXhwIjoiMjAyMi0wOS0wM1QxMTozMzozMS41NDk1NjM0WiIsImFub24iOnRydWUsImZmIjpbIktlcm5lbFZpZXdlckNsaWVudExvYWRlZFRhZ3MiLCJLZXJuZWxzRmlyZWJhc2VQcm94eSIsIktlcm5lbHNHQ1NVcGxvYWRQcm94eSIsIktlcm5lbHNGaXJlYmFzZUxvbmdQb2xsaW5nIiwiS2VybmVsc1N0YWNrT3ZlcmZsb3dTZWFyY2giLCJLZXJuZWxFZGl0b3JSZWZhY3RvcmVkU3VibWl0TW9kYWwiLCJLZXJuZWxzTWF0ZXJpYWxMaXN0aW5nIiwiQ29tbXVuaXR5S21JbWFnZVVwbG9hZGVyIiwiVFBVQ29tbWl0U2NoZWR1bGluZyIsIkNvbW1pdFNjaGVkdWxpbmciLCJBbGxvd0ZvcnVtQXR0YWNobWVudHMiLCJLTUxlYXJuRGV0YWlsIiwiRnJvbnRlbmRDb25zb2xlRXJyb3JSZXBvcnRpbmciLCJQaG9uZVZlcmlmeUZvckNvbW1lbnRzIiwiUGhvbmVWZXJpZnlGb3JOZXdUb3BpYyIsIkluQ2xhc3NUb0NvbW11bml0eVBhZ2VzIiwiS21Db21wc1RlYW1QYWdlIiwiQ29tcGV0aXRpb25zVGVhbVVwIiwiQ29tcGV0aXRpb25zTFBNdWx0aWxpbmVDaGlwIl0sImZmZCI6eyJLZXJuZWxFZGl0b3JBdXRvc2F2ZVRocm90dGxlTXMiOiIzMDAwMCIsIkZyb250ZW5kRXJyb3JSZXBvcnRpbmdTYW1wbGVSYXRlIjoiMC4wMSIsIkVtZXJnZW5jeUFsZXJ0QmFubmVyIjoieyB9IiwiQ2xpZW50UnBjUmF0ZUxpbWl0IjoiNDAiLCJGZWF0dXJlZENvbW11bml0eUNvbXBldGl0aW9ucyI6IjMzNjExLDMzNjg5LDM0MTg5LDM1MDM3LDM1NDI3LDM1MjkxLCAzNTc5NywgMzU3NjgsIDM1MzI1LCAzNTQyOSwgMzQ5MDksIDMzNTc5LDM3MDY5LDM2MTYxIiwiQWRkRmVhdHVyZUZsYWdzVG9QYWdlTG9hZFRhZyI6ImRhdGFzZXRzTWF0ZXJpYWxEZXRhaWwifSwicGlkIjoia2FnZ2xlLTE2MTYwNyIsInN2YyI6IndlYi1mZSIsInNkYWsiOiJBSXphU3lBNGVOcVVkUlJza0pzQ1pXVnotcUw2NTVYYTVKRU1yZUUiLCJibGQiOiI4OGFmYWZkMjE4NjQzM2M0ZGI5MDI2NzM5MTk4Mzk5ZjAxZTM3MzFjIn0.; GCLB=CIm03ZDxhLHwcQ; _ga=GA1.2.1717669489.1659526414; _gid=GA1.2.312119353.1659526414; _gat_gtag_UA_12629138_1=1',
      Referer: 'https://www.kaggle.com/code?sortBy=dateCreated',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    body: JSON.stringify(body),
    method: 'POST',
  });
  const data = (await res.json()) as IdList;
  return data;
}

async function getDetail(idList: number[]) {
  const body = {
    deletedAccessBehavior: 'RETURN_NOTHING',
    unauthorizedAccessBehavior: 'RETURN_NOTHING',
    excludeResultsFilesOutputs: false,
    wantOutputFiles: false,
    kernelIds: idList,
    outputFileTypes: [],
    includeInvalidDataSources: false,
  };
  const res = await fetch('https://www.kaggle.com/api/i/kernels.KernelsService/GetKernelListDetails', {
    headers: {
      accept: 'application/json',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      pragma: 'no-cache',
      'sec-ch-ua': `".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"`,
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': `"Windows"`,
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'x-xsrf-token': 'CfDJ8J3M_yAX7KFLocPnRStQF54zBE5ldMG-CA7Z3RxGr73yfBlHvZNvIykqjL0ZlRYLfGMjWHF12bzm3PP_QEqkcUoTAf2HRL3vSYpwR4a2ImZhDg',
      cookie:
        'ka_sessionid=e714cfaf04926f5de0114d976f1a3008; CSRF-TOKEN=CfDJ8J3M_yAX7KFLocPnRStQF54Ad1VFmNaFuHJ9-xNjMsxYB-SxNGF1JLnBgxDiS8H7O3Swwy15lRj9wT3Gaa-L43Cdrd8XgI8zqshIsCPNsg; XSRF-TOKEN=CfDJ8J3M_yAX7KFLocPnRStQF54zBE5ldMG-CA7Z3RxGr73yfBlHvZNvIykqjL0ZlRYLfGMjWHF12bzm3PP_QEqkcUoTAf2HRL3vSYpwR4a2ImZhDg; CLIENT-TOKEN=eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpc3MiOiJrYWdnbGUiLCJhdWQiOiJjbGllbnQiLCJzdWIiOm51bGwsIm5idCI6IjIwMjItMDgtMDNUMTE6MzM6MzEuNTQ5NTYzNFoiLCJpYXQiOiIyMDIyLTA4LTAzVDExOjMzOjMxLjU0OTU2MzRaIiwianRpIjoiODFjZTIwODEtYWMyZi00NWVhLThmMGUtODVhNGMwNWE3Njc5IiwiZXhwIjoiMjAyMi0wOS0wM1QxMTozMzozMS41NDk1NjM0WiIsImFub24iOnRydWUsImZmIjpbIktlcm5lbFZpZXdlckNsaWVudExvYWRlZFRhZ3MiLCJLZXJuZWxzRmlyZWJhc2VQcm94eSIsIktlcm5lbHNHQ1NVcGxvYWRQcm94eSIsIktlcm5lbHNGaXJlYmFzZUxvbmdQb2xsaW5nIiwiS2VybmVsc1N0YWNrT3ZlcmZsb3dTZWFyY2giLCJLZXJuZWxFZGl0b3JSZWZhY3RvcmVkU3VibWl0TW9kYWwiLCJLZXJuZWxzTWF0ZXJpYWxMaXN0aW5nIiwiQ29tbXVuaXR5S21JbWFnZVVwbG9hZGVyIiwiVFBVQ29tbWl0U2NoZWR1bGluZyIsIkNvbW1pdFNjaGVkdWxpbmciLCJBbGxvd0ZvcnVtQXR0YWNobWVudHMiLCJLTUxlYXJuRGV0YWlsIiwiRnJvbnRlbmRDb25zb2xlRXJyb3JSZXBvcnRpbmciLCJQaG9uZVZlcmlmeUZvckNvbW1lbnRzIiwiUGhvbmVWZXJpZnlGb3JOZXdUb3BpYyIsIkluQ2xhc3NUb0NvbW11bml0eVBhZ2VzIiwiS21Db21wc1RlYW1QYWdlIiwiQ29tcGV0aXRpb25zVGVhbVVwIiwiQ29tcGV0aXRpb25zTFBNdWx0aWxpbmVDaGlwIl0sImZmZCI6eyJLZXJuZWxFZGl0b3JBdXRvc2F2ZVRocm90dGxlTXMiOiIzMDAwMCIsIkZyb250ZW5kRXJyb3JSZXBvcnRpbmdTYW1wbGVSYXRlIjoiMC4wMSIsIkVtZXJnZW5jeUFsZXJ0QmFubmVyIjoieyB9IiwiQ2xpZW50UnBjUmF0ZUxpbWl0IjoiNDAiLCJGZWF0dXJlZENvbW11bml0eUNvbXBldGl0aW9ucyI6IjMzNjExLDMzNjg5LDM0MTg5LDM1MDM3LDM1NDI3LDM1MjkxLCAzNTc5NywgMzU3NjgsIDM1MzI1LCAzNTQyOSwgMzQ5MDksIDMzNTc5LDM3MDY5LDM2MTYxIiwiQWRkRmVhdHVyZUZsYWdzVG9QYWdlTG9hZFRhZyI6ImRhdGFzZXRzTWF0ZXJpYWxEZXRhaWwifSwicGlkIjoia2FnZ2xlLTE2MTYwNyIsInN2YyI6IndlYi1mZSIsInNkYWsiOiJBSXphU3lBNGVOcVVkUlJza0pzQ1pXVnotcUw2NTVYYTVKRU1yZUUiLCJibGQiOiI4OGFmYWZkMjE4NjQzM2M0ZGI5MDI2NzM5MTk4Mzk5ZjAxZTM3MzFjIn0.; GCLB=CIm03ZDxhLHwcQ; _ga=GA1.2.1717669489.1659526414; _gid=GA1.2.312119353.1659526414; _gat_gtag_UA_12629138_1=1',
      Referer: 'https://www.kaggle.com/code?sortBy=dateCreated',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    body: JSON.stringify(body),
    method: 'POST',
  });
  const data = (await res.json()) as Detail;
  return data;
}

// getIdList(1);

// https://www.kaggle.com/kernels/scriptcontent/29300695/download

(async () => {
  if (!fs.pathExistsSync('./data/kaggle')) {
    fs.mkdirSync('./data/kaggle', { recursive: true });
  }
  const existFilePathList = glob.sync('./data/kaggle/*.ipynb');
  let page = Math.floor(existFilePathList.length / 100);
  while (true) {
    page += 1;
    console.log('page', page);
    const idData = await getIdList(page);
    const idList = idData.kernelIds;
    if (!idList?.length) {
      console.log('no data anymore');
      break;
    }
    const filteredIdList = idList.filter((id) => {
      const isExist = existFilePathList.some((p) => p.includes(`${id}`));
      if (isExist) {
        console.log('jump', id);
      }
      return !isExist;
    });
    if (!filteredIdList.length) {
      continue;
    }
    const detailData = await getDetail(filteredIdList);
    for (const detail of detailData.kernels) {
      const date = detail.scriptVersionDateCreated;
      if (dayjs(date).year() >= 2021) {
        const url = `https://www.kaggle.com/kernels/scriptcontent/${detail.scriptVersionId}/download`;
        try {
          const data = await download(url);
          const fileName = `${detail.title}_${detail.id}`.replace(/[/*?:">|]*/g, '');
          fs.writeFileSync(`./data/kaggle/${fileName}.ipynb`, data);
          console.log('download', detail.title);
        } catch (error) {
          console.log('download fail', detail.title);
        }
        await delay(6*1000)
      } else {
        console.log('spider is over');
        return;
      }
    }
  }
})();
