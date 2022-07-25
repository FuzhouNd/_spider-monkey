export function querySelector(dom = document, selector: string) {
  return dom.querySelector(selector);
}
export function textContent(dom: HTMLElement) {
  return dom?.textContent || '';
}
