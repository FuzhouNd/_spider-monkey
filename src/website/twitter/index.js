let GUrl = [];

function post(body) {
  return fetch('https://twitter.com/localhost/api/set', {
    headers: {
      accept: 'application/json, */*; q=0.01',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      origin: '127.0.0.1:8888',
    },
    body: JSON.stringify(body),
    method: 'POST',
    credentials: 'omit',
  });
}

async function getUrl() {
  const urlList = [...document.querySelectorAll('[data-testid="tweet"]')].map((e) => {
    const text = (e.querySelector('[data-testid="tweetText"]')?.textContent || '').replace(/[\s;]/g, ' ');
    const date = e.querySelector('time')?.getAttribute?.('datetime') || '';
    return { text, date };
  });
  for (const { text, date } of urlList) {
    if (!GUrl.includes(text)) {
      GUrl.push(text);
      await post({ filePath: './data/twdd.csv', data: { date, text } });
    }
  }
}

function cscrollBy(y = 2000) {
  document.querySelector('html').scrollBy(0, y);
}

function delay(n = 6 * 1000) {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, n);
  });
}

(async () => {
  for (let index = 0; index < 100; index++) {
    cscrollBy(3000);
    await delay(2 * 1000);
    getUrl();
  }
})();
