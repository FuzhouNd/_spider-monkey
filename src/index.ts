import jsdom from 'jsdom';
import fetch from 'node-fetch';
import fs from 'fs-extra';


const dom = new jsdom.JSDOM('<div></div>');
console.log(dom);
console.log(fetch);
console.log(fs);
