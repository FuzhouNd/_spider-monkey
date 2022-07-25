export function querySelector(dom = document, selector: string) {
  return dom.querySelector(selector);
}

export function querySelectorAll(dom = document, selector: string) {
  return [...dom.querySelectorAll(selector)];
}
export function textContent(dom: HTMLElement | HTMLElement[]) {
  if (Array.isArray(dom)) {
    return dom.map((d) => d?.textContent || '');
  }
  return dom?.textContent || '';
}
