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
// @description  help control browser
// @author       zxxzzzzz
// @include      *
// @icon         https://cdn.onlinewebfonts.com/svg/img_562349.png
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
