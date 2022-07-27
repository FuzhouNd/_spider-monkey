export function querySelector(dom: HTMLElement | Document = document, selector: string) {
  return dom.querySelector(selector);
}

export function querySelectorAll(dom:   HTMLElement | Document = document, selector: string) {
  return [...dom.querySelectorAll(selector)];
}
export function textContent(dom: HTMLElement) {
  return dom?.textContent || '';
}
