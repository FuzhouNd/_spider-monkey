import { defineConfig } from 'vite';
import path from 'path';
import { loadEnv } from 'vite';
import banner from 'vite-plugin-banner';

const env = loadEnv('production', './');

// vite.config.ts
// Other dependencies...

const desc = `
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
`;

export default defineConfig({
  root: './',
  build: {
    lib: {
      entry: './src/browser/index.ts',
      name: 'spider_monkey_runtime',
      formats: ['iife'],
      fileName: 'runtime',
    },
  },
  resolve: {
    alias: [{ find: '@/', replacement: path.resolve(__dirname, './src/') + '/' }],
  },
  plugins: [
    banner({
      content: desc,
    }),
  ],
});
