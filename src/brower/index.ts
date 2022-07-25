function queryAll(selector = '', document: Document) {
  return [...document.querySelectorAll(selector)];
};

function getHref(a: HTMLLinkElement) {
  return a.getAttribute('href');
}

async function createPage(url:string, id:string, n:number) {
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.id = id;
  iframe.style = 'position:absolute;top:0;left:0;z-index:10000;width:100vw;height:100vh';
  document.body.appendChild(iframe);
  await delay(n);
  return iframe;
}


function delay(n = 6 * 1000) {
  return new Promise<void>((res) => {
    setTimeout(() => {
      res();
    }, n);
  });
}