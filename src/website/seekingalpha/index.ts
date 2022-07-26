import R from 'ramda';
import fetch from 'node-fetch';
import { writeFile,readFile } from '@/fs';
import { Data } from './type';
import { delay } from '@/utils';

const Cookie =
  'machine_cookie=5818025276666; LAST_VISITED_PAGE=%7B%22pathname%22%3A%22https%3A%2F%2Fseekingalpha.com%2Fearnings%2Fearnings-call-transcripts%22%2C%22pageKey%22%3A%22e4b332c6-ce02-4b89-8d20-b8ebe1751ac4%22%7D; _pctx=%7Bu%7DN4IgDghg5gpgagSxgdwJIBMQC4QBsBsAjAMYAWALAJwDMA1gF7EC2AdgC7K4gA0IARgCcA9sgDOMARmx58ABgCO5IQFYAZrTBhCCNvIBuPEAFdxA0dhZHcuXiYkBlNhDYmLVmyFE6YUrJesAvkA; _cls_v=0f73512f-1cbe-449a-b228-47b87e01300e; _cls_s=6e890a13-c6dd-4906-8868-637216423677:0; __pat=-14400000; __pvi=%7B%22id%22%3A%22v-2022-07-26-06-26-51-233-g30jyDxP47V4oDqT-f36accf14974e7e8048d2b803e87d6e8%22%2C%22domain%22%3A%22.seekingalpha.com%22%2C%22time%22%3A1658789560265%7D; xbc=%7Bkpex%7D-Lj4Twqhhfvthr2zV-LxIPnSp69gvqSXT6vBBf3xZqr7W5KNXQiQMi3AGsp3Vv05t6L3UncILgw7vjCcGtrEqXn1CjEb-GXVv_hrlZy5iRHS5Z-0w8zVh4Vs4QkqaSvVEcZ6Xlv0SeOHmy2JZqKSTfkJNIK5haeGd9Q2dOlBEHLD6p0DnMc1g-buSw0fFP1esaGqEQupEAdovc0LYAdYrJRRTPtiC-Lwcs7LsR4nROS3M0vYePFwy5HW4ELBcReSE81MDzGWSiD7KEUhkEkx9scySJCIIMlSYSgqVm_cID9ToZoAvf8Kl3NXK0DTuaT0gNOo7Gt_3AimxdckxRDiHURy8oPVPc6E377s5IX4_JsMMMjQ6l9GXTKAfyqoIiW-gawMnAknqxAO1vfWC_jNyXhdrhCd2lVXC0vCeLMLOm4_G1LfnnBfPXcDEPfH6pUkMQsBFrWbaybBgiJ0FR3v6XnZhKgAqGT2s7RDEsLXWVE; _gcl_au=1.1.186603655.1658752029; _ga=GA1.2.1814466335.1658752029; _gid=GA1.2.1519628656.1658752029; _clck=1fp4hh2|1|f3g|0; pxcts=1d1cb6f0-0c15-11ed-932a-706b44745351; _pxvid=1d1ca92d-0c15-11ed-932a-706b44745351; _pxde=061625967e03f6b35e8d7b89ebdfa54157708e627b4c5c61100b46016a5b5b4e:eyJ0aW1lc3RhbXAiOjE2NTg3OTI4NDE3MTIsImZfa2IiOjB9; _clsk=loijk3|1658789569402|7|1|d.clarity.ms/collect; user_id=56892847; user_nick=; user_devices=; u_voc=; marketplace_author_slugs=; user_cookie_key=lgce16; has_paid_subscription=false; user_perm=; sapu=101; user_remember_token=60fd51f2eabb074394ddbaaa599bf0ed2e18de7a; gk_user_access=1**1658754141; gk_user_access_sign=0c78b0dfd4e7c4a2d832453508683c1eb2b496a4; __tac=; __tae=1658756214511; _fbp=fb.1.1658756218528.609242198; _cc_id=f584d8a87cc898544d56d0eb1b74ec57; panoramaId_expiry=1658844905550; _px2=eyJ1IjoiN2RmOTg4MjAtMGM2Yy0xMWVkLTlhYzEtN2YyMzJmOWVmM2VjIiwidiI6IjFkMWNhOTJkLTBjMTUtMTFlZC05MzJhLTcwNmI0NDc0NTM1MSIsInQiOjE2NTg3OTMzNDE3MTIsImgiOiJlZGJlMmY1ZTM2MzE5MjQyZDYwZWQwNDE0MGJhNDY0MWRiZWU1ZDQ1Yzg1OTAwZmJiYzM4OWExYWNmOGViZThjIn0=; _px=eE8EnKb2ExGr9QP/bQz4CYP91EdXrLPa7cFztHVMCGaSo7NcaUpx+AmprcNqZYhjJ7NhUt2H1DcLNkyeH5wzlA==:1000:kNSUAmiuVEUT/f+pS/idCSakfkYjwebwgZh1SG/i6s86YMSQkoA7aSkpEf5jSKRr1/rhzReJ8WLZPBSDQR6bZGnerh3jmGoZ4s1PWaU/aRIX5N6J5CzTc2pgownTKAY6EqAGoQG51fPUJ5ncXCuUdIdswz9xBj1sOyi0PW30jeQkzH8Tp6mN8+j3bLMlnVC4Hu0+XKSZgKWz0LQM0/CqcN0t4RXTcA4mcuNGKj7Y25xGiM3QYKSN7IiIjx+M2LH+Q1znzkuq4so0YCcm9SPSsQ==; _uetsid=1a44b5400c1511ed9475a7dff6e3f6f8; _uetvid=1a44fc000c1511ed97e193897e14eea9; __tbc=%7Bkpex%7DAaHlrgzKBCcPGHgO9V9ybnrS5zeCx8QZGpchm3s0cH8Sjs5_Y6KEq8A9SykhCc6l83aejEdp4tXDkHg48Vt3Achiplrlc38HaUJWSdHYOiR52YSoAKhk9rO0QxLC11lR';

async function getArticleUrl() {
  const hiIndex = parseInt(readFile('./data/hi.csv').slice(-1)[0][0], 10)
  for (const index of R.range(hiIndex, 4711)) {
    const res = await fetch(
      `https://seekingalpha.com/api/v3/articles?cacheBuster=2022-07-25&filter[category]=earnings%3A%3Aearnings-call-transcripts&filter[since]=1262311200&filter[until]=1641088799.999&include=author%2CprimaryTickers%2CsecondaryTickers&isMounting=true&page[size]=40&page[number]=${index}`,
      {
        // @ts-ignore
        credentials: 'include',
        headers: {
          Cookie,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:103.0) Gecko/20100101 Firefox/103.0',
          Accept: '*/*',
          'Accept-Language': 'zh-CN,en-US;q=0.7,en;q=0.3',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          Pragma: 'no-cache',
          'Cache-Control': 'no-cache',
        },
        referrer:
          'https://seekingalpha.com/earnings/earnings-call-transcripts?from=2009-12-31T13%3A00%3A00.000Z&page=2&to=2022-01-01T12%3A59%3A59.999Z',
        method: 'GET',
        mode: 'cors',
      }
    );
    const data = (await res.json()) as Data;
    if (!data?.data) {
      console.log('stop at', index);
      writeFile('./data/hi.csv', `${index}`)
      break;
    }
    // console.log(data.data[0].links);
    (data?.data || []).forEach((d) => {
      writeFile('./data/seek.csv', d.links?.self || '');
    });
    console.log('page', index);
    // await delay(10 * 1000);
  }
}

getArticleUrl();
