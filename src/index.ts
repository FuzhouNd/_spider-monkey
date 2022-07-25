import jsdom from 'jsdom';
import fetch from 'node-fetch';
import fs from 'fs-extra';
import R from 'Ramda';
import { readFile, writeFile } from './fs';

// const dom = new jsdom.JSDOM('<div></div>');
// console.log(dom);
// console.log(fetch);
// console.log(fs);

writeFile(
  './data/caiapn2.csv',
  R.uniqBy((a) => {
    return a[1];
  }, readFile('./data/caipannnn.csv'))
);
