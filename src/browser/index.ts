// ==UserScript==
// @name         spider-runtime
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo/related?hl=zh-CN
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==
import { initSocket } from '@/browser/socket/index';
initSocket()
export default {
  version: '0.0.1',
};
// function queryAll(selector = '') {
//   return [...document.querySelectorAll(selector)];
// }

// function getHref(a: HTMLLinkElement) {
//   return a.getAttribute('href');
// }
