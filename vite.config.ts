import { defineConfig } from 'vite';
import path from 'path';
import {loadEnv} from 'vite';

const env = loadEnv('production', './')


export default defineConfig({
  root: './',
  build: {
    lib: {
      entry: './src/browser/index.ts',
      name: 'spider_monkey_runtime',
      formats: ['iife'],
      fileName:'runtime',
    },
  },
  resolve: {
    alias: [{ find: '@/', replacement: path.resolve(__dirname, './src/') + '/' }],
  },
});
