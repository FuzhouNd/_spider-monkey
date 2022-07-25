//s.wanfangdata.com.cn/patent?q=%E4%B8%AD%E5%9B%BD%E9%95%BF%E5%9F%8E%E7%A7%91%E6%8A%80%E9%9B%86%E5%9B%A2%E8%82%A1%E4%BB%BD%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8&p=1&facet=%5B%7B%22PatentType%22%3A%7B%22label%22%3A%22%E5%8F%91%E6%98%8E%E4%B8%93%E5%88%A9%22,%22value%22%3A%22%E5%8F%91%E6%98%8E%E4%B8%93%E5%88%A9%22,%22number%22%3A118,%22desc%22%3A%22%22,%22title%22%3A%22%E4%B8%93%E5%88%A9%E7%B1%BB%E5%9E%8B%22,%22children%22%3A%5B%5D%7D%7D%5D

// https: `https://s.wanfangdata.com.cn/patent?q=中国长城科技集团股份有限公司&p=1&facet=[{"PatentType":{"label":"发明专利","value":"发明专利","number":118,"desc":"","title":"专利类型","children":[]}}]`;


function queryAll(selector = '', document: Document) {
  // @ts-ignore
  return [...document.querySelectorAll(selector)];
}

function getHref(a: HTMLLinkElement) {
  return a.getAttribute('href');
}

async function createPage(url: string, id: string, n?: number) {
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.id = id;
  //@ts-ignore
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

async function getFV(document: Document) {
  const container = queryAll('.wf-facet-box', document).find((d) => (d.textContent || '').includes('法律'));
  if (!container) {
    return;
  }
  const btn = container.querySelector('.facet-title');
  if (!btn) {
    return;
  }
  (btn as HTMLSpanElement).click();
  await delay(1 * 1000);
  return queryAll('.facet-list-box .list-item', document).map(d => {
    return d.textContent || ''
  }).join(',')
}

// getFV(window.document)
async function get(name:string) {
  const urlPrefix = `https://s.wanfangdata.com.cn/patent?q=${name}&p=1&facet=`
  const a = [{"PatentType":{"label":"发明专利","value":"发明专利","number":118,"desc":"","title":"专利类型","children":[]}},{"CountryOrganization":{"label":"中国","value":"CN","number":118,"desc":"","title":"国家/地区/组织","children":[]}}]
  const b = [{"PatentType":{"label":"实用新型","value":"实用新型","number":118,"desc":"","title":"专利类型","children":[]}},{"CountryOrganization":{"label":"中国","value":"CN","number":118,"desc":"","title":"国家/地区/组织","children":[]}}]
  const c = [{"PatentType":{"label":"外观设计","value":"外观设计","number":118,"desc":"","title":"专利类型","children":[]}},{"CountryOrganization":{"label":"中国","value":"CN","number":118,"desc":"","title":"国家/地区/组织","children":[]}}]
  const frame1 = await createPage(urlPrefix + encodeURIComponent(JSON.stringify(a)), 'pp1pp')
  if(frame1.contentDocument){
    const str = getFV(frame1.contentDocument)
    console.log(str);
  }
  frame1.remove()
}

get('沈阳机床股份有限公司')
