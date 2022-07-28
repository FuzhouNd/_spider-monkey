export enum ACTION {
  'querySelector' = 'querySelector',
  'querySelectorAll' = 'querySelectorAll',
  'textContent' = 'textContent',
  'input' = 'input',
  'map' = 'map',
}

export const FUNC_PREFIX = '__func__';

export enum MESSAGE_TYPE {
  init = 'init',
  data = 'data',
  payload = 'payload',
  store = 'store',
}
