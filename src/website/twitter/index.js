function getUrl() {
  const urlList = [...document.querySelectorAll('[data-testid="cellInnerDiv"] a[dir="auto"]')].map((e) => {
    return e?.href || ''
  })
  console.log(urlList);
}

function cscrollBy(params) {
  document.querySelector('html').scrollBy(0, 1000)
}

function delay(n = 6 * 1000) {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, n);
  });
}


(async ()=>{
  for (let index = 0; index < 100; index++) {
    cscrollBy()
    await delay(2*1000)
  }
})()

