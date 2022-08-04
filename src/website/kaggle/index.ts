import fetch from 'node-fetch';
import { Detail, IdList, Comput } from './type';
import dayjs from 'dayjs';
import download from 'download';
import fs from 'fs-extra';
import glob from 'glob';
import { delay } from '@/utils';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { writeFile, readFile, readCsv, writeCsv } from '@/fs';

const Cookie = `ka_sessionid=f18e1e86703c044a021cb43e1d40832b; CSRF-TOKEN=CfDJ8J3M_yAX7KFLocPnRStQF56D9dlkrmYstH2pFr6AzLBkiUDGqSbEpLMXH57it6WgvGISy3J3791vHtXqebojWOsWg1L4Vfw6CtflPF1cXQ; GCLB=CJzA3unU3omEHw; _ga=GA1.2.1142530108.1659516613; _gid=GA1.2.382290769.1659516613; __Host-KAGGLEID=CfDJ8J3M_yAX7KFLocPnRStQF56b0rvbefdJ5FHecPrECEuh_Ca_-miOc9PiEKBLWU3UEZ-4WbKYj6p8AUqEV9nIU72cxp_9S4CoCqpgLTUoTfavc5TdYweSJw; _gat_gtag_UA_12629138_1=1; searchToken=b6ec1a5c-429b-440c-9b59-ada380ab2898; XSRF-TOKEN=CfDJ8J3M_yAX7KFLocPnRStQF55X4ESc9OHhROoq91C1CCUMEWnZkDmMnFUks5G4GBQq1jW-8b3GKyKThggKZ-d7gQsIyah1UauT7R2QZI1rbr0DFoH593R8glYDmIQvQSkJSYzRmy1z5RIjaDsV_6l6ISo; CLIENT-TOKEN=eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpc3MiOiJrYWdnbGUiLCJhdWQiOiJjbGllbnQiLCJzdWIiOiJ6eHh6enp6eiIsIm5idCI6IjIwMjItMDgtMDRUMDg6MDA6MzUuOTU1NDU4M1oiLCJpYXQiOiIyMDIyLTA4LTA0VDA4OjAwOjM1Ljk1NTQ1ODNaIiwianRpIjoiZTM0NWFlODMtNGRjNy00MGMxLWE3YWUtMTdmNDUxNDgwODkyIiwiZXhwIjoiMjAyMi0wOS0wNFQwODowMDozNS45NTU0NTgzWiIsInVpZCI6MTEyMDg3MDUsImRpc3BsYXlOYW1lIjoienh4enp6enoiLCJlbWFpbCI6IjgxMjYwMzg3MkBxcS5jb20iLCJ0aWVyIjoiTm92aWNlIiwidmVyaWZpZWQiOmZhbHNlLCJwcm9maWxlVXJsIjoiL3p4eHp6enp6IiwidGh1bWJuYWlsVXJsIjoiaHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2thZ2dsZS1hdmF0YXJzL3RodW1ibmFpbHMvZGVmYXVsdC10aHVtYi5wbmciLCJmZiI6WyJLZXJuZWxzRHJhZnRVcGxvYWRCbG9iIiwiS2VybmVsVmlld2VyQ2xpZW50TG9hZGVkVGFncyIsIktlcm5lbHNGaXJlYmFzZVByb3h5IiwiS2VybmVsc0dDU1VwbG9hZFByb3h5IiwiS2VybmVsc0ZpcmViYXNlTG9uZ1BvbGxpbmciLCJLZXJuZWxzU3RhY2tPdmVyZmxvd1NlYXJjaCIsIktlcm5lbEVkaXRvclJlZmFjdG9yZWRTdWJtaXRNb2RhbCIsIktlcm5lbHNNYXRlcmlhbExpc3RpbmciLCJDb21tdW5pdHlLbUltYWdlVXBsb2FkZXIiLCJUUFVDb21taXRTY2hlZHVsaW5nIiwiQ29tbWl0U2NoZWR1bGluZyIsIkFsbG93Rm9ydW1BdHRhY2htZW50cyIsIktlcm5lbHNTYXZlQ2VsbE91dHB1dCIsIktNTGVhcm5EZXRhaWwiLCJGcm9udGVuZENvbnNvbGVFcnJvclJlcG9ydGluZyIsIlBob25lVmVyaWZ5Rm9yQ29tbWVudHMiLCJQaG9uZVZlcmlmeUZvck5ld1RvcGljIiwiSW5DbGFzc1RvQ29tbXVuaXR5UGFnZXMiLCJLbUNvbXBzVGVhbVBhZ2UiLCJDb21wZXRpdGlvbnNUZWFtVXAiLCJDb21wZXRpdGlvbnNMUE11bHRpbGluZUNoaXAiXSwiZmZkIjp7Iktlcm5lbEVkaXRvckF1dG9zYXZlVGhyb3R0bGVNcyI6IjMwMDAwIiwiRnJvbnRlbmRFcnJvclJlcG9ydGluZ1NhbXBsZVJhdGUiOiIwLjAxIiwiRW1lcmdlbmN5QWxlcnRCYW5uZXIiOiJ7IH0iLCJDbGllbnRScGNSYXRlTGltaXQiOiI0MCIsIkZlYXR1cmVkQ29tbXVuaXR5Q29tcGV0aXRpb25zIjoiMzM2MTEsMzM2ODksMzQxODksMzUwMzcsMzU0MjcsMzUyOTEsIDM1Nzk3LCAzNTc2OCwgMzUzMjUsIDM1NDI5LCAzNDkwOSwgMzM1NzksMzcwNjksMzYxNjEiLCJBZGRGZWF0dXJlRmxhZ3NUb1BhZ2VMb2FkVGFnIjoiZGF0YXNldHNNYXRlcmlhbERldGFpbCJ9LCJwaWQiOiJrYWdnbGUtMTYxNjA3Iiwic3ZjIjoid2ViLWZlIiwic2RhayI6IkFJemFTeUE0ZU5xVWRSUnNrSnNDWldWei1xTDY1NVhhNUpFTXJlRSIsImJsZCI6IjY5MGIzNjNmNTgyNTU3N2FhZTNmN2ZlNGE0NTVjYmFiNWU4Y2ExMWEifQ.`;

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

async function getListCompetitions(page: number) {
  const body = {
    selector: {
      competitionIds: [],
      listOption: 'LIST_OPTION_DEFAULT',
      sortOption: 'SORT_OPTION_NEWEST',
      hostSegmentIdFilter: 0,
      searchQuery: '',
      prestigeFilter: 'PRESTIGE_FILTER_UNSPECIFIED',
      participationFilter: 'PARTICIPATION_FILTER_UNSPECIFIED',
      tagIds: [],
      requireSimulations: false,
    },
    pageToken: page === 1 ? '' : `${(page - 1) * 20}`,
    pageSize: 20,
  };
  const res = await fetch('https://www.kaggle.com/api/i/competitions.CompetitionService/ListCompetitions', {
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
      'x-xsrf-token':
        'CfDJ8J3M_yAX7KFLocPnRStQF56_d8VCpAUcWfJWvQiWFpLHGosMVHB9fHFSbdDrxcnkA6nS4XWNxSVebGTYJSp-gQQNlurhQzMxdtHv6_gm4w7gC1n3G7FdRF_dJlrLxkYmSge1PzM7QW0zj-DwYys4KLg',
      cookie:
        'ka_sessionid=f18e1e86703c044a021cb43e1d40832b; CSRF-TOKEN=CfDJ8J3M_yAX7KFLocPnRStQF56D9dlkrmYstH2pFr6AzLBkiUDGqSbEpLMXH57it6WgvGISy3J3791vHtXqebojWOsWg1L4Vfw6CtflPF1cXQ; GCLB=CJzA3unU3omEHw; _ga=GA1.2.1142530108.1659516613; _gid=GA1.2.382290769.1659516613; __Host-KAGGLEID=CfDJ8J3M_yAX7KFLocPnRStQF56b0rvbefdJ5FHecPrECEuh_Ca_-miOc9PiEKBLWU3UEZ-4WbKYj6p8AUqEV9nIU72cxp_9S4CoCqpgLTUoTfavc5TdYweSJw; _gat_gtag_UA_12629138_1=1; XSRF-TOKEN=CfDJ8J3M_yAX7KFLocPnRStQF56_d8VCpAUcWfJWvQiWFpLHGosMVHB9fHFSbdDrxcnkA6nS4XWNxSVebGTYJSp-gQQNlurhQzMxdtHv6_gm4w7gC1n3G7FdRF_dJlrLxkYmSge1PzM7QW0zj-DwYys4KLg; CLIENT-TOKEN=eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpc3MiOiJrYWdnbGUiLCJhdWQiOiJjbGllbnQiLCJzdWIiOiJ6eHh6enp6eiIsIm5idCI6IjIwMjItMDgtMDRUMDA6Mzg6NTIuNTkyODgxMVoiLCJpYXQiOiIyMDIyLTA4LTA0VDAwOjM4OjUyLjU5Mjg4MTFaIiwianRpIjoiYTVkMjI5N2ItZDY4Yi00NjQ0LWFhYzktMWMxMmM1NDBiNmNlIiwiZXhwIjoiMjAyMi0wOS0wNFQwMDozODo1Mi41OTI4ODExWiIsInVpZCI6MTEyMDg3MDUsImRpc3BsYXlOYW1lIjoienh4enp6enoiLCJlbWFpbCI6IjgxMjYwMzg3MkBxcS5jb20iLCJ0aWVyIjoiTm92aWNlIiwidmVyaWZpZWQiOmZhbHNlLCJwcm9maWxlVXJsIjoiL3p4eHp6enp6IiwidGh1bWJuYWlsVXJsIjoiaHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2thZ2dsZS1hdmF0YXJzL3RodW1ibmFpbHMvZGVmYXVsdC10aHVtYi5wbmciLCJmZiI6WyJLZXJuZWxzRHJhZnRVcGxvYWRCbG9iIiwiS2VybmVsVmlld2VyQ2xpZW50TG9hZGVkVGFncyIsIktlcm5lbHNGaXJlYmFzZVByb3h5IiwiS2VybmVsc0dDU1VwbG9hZFByb3h5IiwiS2VybmVsc0ZpcmViYXNlTG9uZ1BvbGxpbmciLCJLZXJuZWxzU3RhY2tPdmVyZmxvd1NlYXJjaCIsIktlcm5lbEVkaXRvclJlZmFjdG9yZWRTdWJtaXRNb2RhbCIsIktlcm5lbHNNYXRlcmlhbExpc3RpbmciLCJDb21tdW5pdHlLbUltYWdlVXBsb2FkZXIiLCJUUFVDb21taXRTY2hlZHVsaW5nIiwiQ29tbWl0U2NoZWR1bGluZyIsIkFsbG93Rm9ydW1BdHRhY2htZW50cyIsIktlcm5lbHNTYXZlQ2VsbE91dHB1dCIsIktNTGVhcm5EZXRhaWwiLCJGcm9udGVuZENvbnNvbGVFcnJvclJlcG9ydGluZyIsIlBob25lVmVyaWZ5Rm9yQ29tbWVudHMiLCJQaG9uZVZlcmlmeUZvck5ld1RvcGljIiwiSW5DbGFzc1RvQ29tbXVuaXR5UGFnZXMiLCJLbUNvbXBzVGVhbVBhZ2UiLCJDb21wZXRpdGlvbnNUZWFtVXAiLCJDb21wZXRpdGlvbnNMUE11bHRpbGluZUNoaXAiXSwiZmZkIjp7Iktlcm5lbEVkaXRvckF1dG9zYXZlVGhyb3R0bGVNcyI6IjMwMDAwIiwiRnJvbnRlbmRFcnJvclJlcG9ydGluZ1NhbXBsZVJhdGUiOiIwLjAxIiwiRW1lcmdlbmN5QWxlcnRCYW5uZXIiOiJ7IH0iLCJDbGllbnRScGNSYXRlTGltaXQiOiI0MCIsIkZlYXR1cmVkQ29tbXVuaXR5Q29tcGV0aXRpb25zIjoiMzM2MTEsMzM2ODksMzQxODksMzUwMzcsMzU0MjcsMzUyOTEsIDM1Nzk3LCAzNTc2OCwgMzUzMjUsIDM1NDI5LCAzNDkwOSwgMzM1NzksMzcwNjksMzYxNjEiLCJBZGRGZWF0dXJlRmxhZ3NUb1BhZ2VMb2FkVGFnIjoiZGF0YXNldHNNYXRlcmlhbERldGFpbCJ9LCJwaWQiOiJrYWdnbGUtMTYxNjA3Iiwic3ZjIjoid2ViLWZlIiwic2RhayI6IkFJemFTeUE0ZU5xVWRSUnNrSnNDWldWei1xTDY1NVhhNUpFTXJlRSIsImJsZCI6IjY5MGIzNjNmNTgyNTU3N2FhZTNmN2ZlNGE0NTVjYmFiNWU4Y2ExMWEifQ.',
      Referer: 'https://www.kaggle.com/competitions',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    body: JSON.stringify(body),
    method: 'POST',
  });
  const data = (await res.json()) as Comput;
  if (!data?.competitions?.length) {
    return [];
  }
  return data.competitions.filter((c) => {
    if (dayjs(c.deadline).year() < 2021) {
      console.log('outdate', c.competitionName);
    }
    return dayjs(c.deadline).year() >= 2021;
  });
}

async function getCDetail(comptId: number) {
  let page = 0;
  const reData = [];
  while (true) {
    page += 1;
    const body = {
      kernelFilterCriteria: {
        search: '',
        listRequest: {
          competitionId: comptId,
          sortBy: 'DATE_CREATED',
          pageSize: 20,
          group: 'EVERYONE',
          page: page,
          tagIds: '',
          excludeResultsFilesOutputs: false,
          wantOutputFiles: false,
        },
      },
      detailFilterCriteria: {
        deletedAccessBehavior: 'RETURN_NOTHING',
        unauthorizedAccessBehavior: 'RETURN_NOTHING',
        excludeResultsFilesOutputs: false,
        wantOutputFiles: false,
        kernelIds: [],
        outputFileTypes: [],
        includeInvalidDataSources: false,
      },
    };
    const res = await fetch('https://www.kaggle.com/api/i/kernels.KernelsService/ListKernels', {
      headers: {
        accept: 'application/json',
        'accept-language': 'zh-CN,zh;q=0.9',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        pragma: 'no-cache',
        'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-xsrf-token':
          'CfDJ8J3M_yAX7KFLocPnRStQF55X4ESc9OHhROoq91C1CCUMEWnZkDmMnFUks5G4GBQq1jW-8b3GKyKThggKZ-d7gQsIyah1UauT7R2QZI1rbr0DFoH593R8glYDmIQvQSkJSYzRmy1z5RIjaDsV_6l6ISo',
        Cookie,
        Referer: 'https://www.kaggle.com/competitions/iwildcam2022-fgvc9/code',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: JSON.stringify(body),
      method: 'POST',
    });
    const data = (await res.json()) as Detail;
    if (!data?.kernels?.length) {
      // console.log('code not anymore');
      return reData;
    }
    const filteredKernelList = data.kernels.filter((d) => {
      if (dayjs(d.scriptVersionDateCreated).year() < 2021) {
        console.log('outdate code', d.title);
      }
      return dayjs(d.scriptVersionDateCreated).year() >= 2021;
    });
    reData.push(...filteredKernelList);
    if (filteredKernelList.length !== data.kernels.length) {
      return reData;
    }
  }
}

// getIdList(1);

// https://www.kaggle.com/kernels/scriptcontent/29300695/download

// (async () => {
//   let existCompIdList: string[] = [];
//   if (!fs.pathExistsSync('./data/kaggle')) {
//     fs.mkdirSync('./data/kaggle', { recursive: true });
//   }
//   if (fs.pathExistsSync('./data/kaggle/compId.csv')) {
//     existCompIdList = readFile('./data/kaggle/compId.csv').map((d) => d[0]);
//   }
//   const argv = await yargs(hideBin(process.argv)).argv;
//   const beginPage = typeof argv.begin !== 'undefined' ? parseInt(argv.begin as string, 10) : 0;
//   const endPage = typeof argv.end !== 'undefined' ? parseInt(argv.end as string, 10) : beginPage;
//   for (let page = beginPage; page <= endPage; page++) {
//     const copmtList = await getListCompetitions(page);
//     console.log('compet page', page);
//     for (const compt of copmtList) {
//       if (existCompIdList.includes(`${compt.id}`)) {
//         console.log('compt exist', compt.competitionName);
//         continue;
//       }
//       const detailList = await getCDetail(compt.id);
//       console.log('compet name', compt.competitionName);
//       for (const detail of detailList) {
//         const fileName = `${detail.title}_${detail.id}`.replace(/[/*?:">|]*/g, '');
//         if (fs.pathExistsSync(`./data/kaggle/${fileName}.ipynb`)) {
//           console.log('exist', fileName);
//           continue;
//         }
//         const url = `https://www.kaggle.com/kernels/scriptcontent/${detail.scriptVersionId}/download`;
//         const date = detail.scriptVersionDateCreated;
//         // const data = await download(url);
//         writeFile('./data/kaggle/url.csv', { date, url, title: detail.title });
//         // fs.writeFileSync(`./data/kaggle/${fileName}.ipynb`, data);
//         // console.log('file download', fileName);
//       }
//       writeFile('./data/kaggle/compId.csv', `${compt.id}`);
//     }
//   }
// })();

// (async () => {
//   const urlList = readFile('./data/kaggle/url.csv').slice(1).map((d) => d[1]);
//   let existIdList: string[] = [];
//   if (fs.pathExistsSync('./data/kaggle/codeId.csv')) {
//     existIdList = readFile('./data/kaggle/codeId.csv').map((d) => d[0]);
//   }
//   for (const url of urlList.slice(0, 500)) {
//     const id = url.split('/').slice(-2)[0];
//     if (existIdList.includes(id)) {
//       console.log('exist', id);
//       continue;
//     }
//     console.log(url);
//     const data = await download(url);
//     //  writeFile('./data/kaggle/url.csv', { date, url });
//     fs.writeFileSync(`./data/kaggle/file/${id}.ipynb`, data);
//     console.log('file download', id);
//     writeFile('./data/codeId.csv', id);
//     await delay(5 * 1000);
//   }
// })();

(async () => {
  const data = await readCsv('./data/kaggle/Competitions.csv');
  const existIdList = (await readCsv('./data/kaggle/compId.csv')).map((d) => (d as { id: string }).id);
  const fComptList = data.filter((d) => {
    return dayjs((d as any).DeadlineDate).year() >= 2021;
  }) as any[];
  for (const compt of fComptList) {
    if (existIdList.includes(compt.Id)) {
      console.log('compet exist', compt.Subtitle, compt.Id);
      continue;
    }
    console.log('compet name', compt.Subtitle, compt.Id);
    const detailList = await getCDetail(compt.Id);
    for (const detail of detailList) {
      const url = `https://www.kaggle.com/kernels/scriptcontent/${detail.scriptVersionId}/download`;
      const date = detail.scriptVersionDateCreated;
      await writeCsv('./data/kaggle/url.csv', [{ date, url, title: detail.title }]);
    }
    await writeCsv('./data/kaggle/compId.csv', [{ id: `${compt.Id}` }]);
  }
})();
