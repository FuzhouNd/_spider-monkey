async function fileGet(path) {
  const res = await fetch('https://twitter.com/localhost/api/get', {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cache-control': 'no-cache',
      'content-type': 'application/json;charset=UTF-8',
      pragma: 'no-cache',
      'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      Referer: 'https://optometry.robotrak.cn/',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    body: JSON.stringify({ filePath: path }),
    method: 'POST',
  });
  const text = await res.text();
  return text;
}
async function fileSet(body) {
  return fetch('https://twitter.com/localhost/api/set', {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cache-control': 'no-cache',
      'content-type': 'application/json;charset=UTF-8',
      pragma: 'no-cache',
      'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      Referer: 'https://optometry.robotrak.cn/',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    body: JSON.stringify(body),
    method: 'POST',
  });
}

async function createPage(url, id, n) {
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.id = id;
  iframe.style = 'position:absolute;top:0;left:0;z-index:10000;width:100vw;height:100vh';
  document.body.appendChild(iframe);
  await delay(n);
  return iframe;
}

function delay(n = 6 * 1000) {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, n);
  });
}

(async () => {
  const text = await fileGet('./data/tw.csv');
  const urlList = text
    .split('\r\n')
    .slice(1)
    .filter((d) => d)
    .map((d) => d.replace(/\s/g, ''));
  for (const url of urlList) {
    const frame = await createPage(url, 'ppp_pp');
    while (true) {
      const btn = [...frame.contentDocument.querySelectorAll('span')].find((d) => d.childNodes[0] === '显示更多回复');
      if (btn) {
        btn.click();
        await delay(3 * 1000);
      } else {
        break;
      }
    }
    const textList = [...frame.contentDocument.querySelectorAll('[data-testid="tweetText"]')].map((d) =>
      (d.textContent || '').replace(/\s/g, '')
    );
    const id = url.split('/').slice(-1)[0];
    await fileSet(
      textList.map((text) => {
        return { filePath: `./data//tw/${id}.csv`, data: text };
      })
    );
    frame.remove()
  }
})();
