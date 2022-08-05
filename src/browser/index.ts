import { initSocket } from '@/browser/socket/index';
setTimeout(() => {
  initSocket();
}, 1000);
export default {
  version: '0.0.1',
};
// function queryAll(selector = '') {
//   return [...document.querySelectorAll(selector)];
// }

// function getHref(a: HTMLLinkElement) {
//   return a.getAttribute('href');
// }
