import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: './',
  // ...
  build: {
    lib: {
      entry: './src/index.ts',
      name: '__socket',
      formats: ['iife', 'umd'],
    },
  },
  resolve: {
    alias: [{ find: '@/', replacement: path.resolve(__dirname, './src/') + '/' }],
  },
});
