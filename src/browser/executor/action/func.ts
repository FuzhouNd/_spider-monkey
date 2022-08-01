import { FUNC_PREFIX } from '@/browser/enum';
import { delay } from '@/utils';
import * as R from 'ramda';

interface ExecFunc {
  (...args: any[]): any;
  destroy: () => void;
}

export async function getFunc(funcStr = '', name = 'zxx'): Promise<ExecFunc> {
  const sc = document.createElement('script');
  const varName = `${FUNC_PREFIX}_${name}`;
  sc.innerHTML = `window.${varName} = ${funcStr};`;
  document.body.append(sc);
  while (true) {
    const func = window[varName];
    if (func) {
      func.destroy = () => {
        window[varName] = void 0;
        sc.remove();
      };
      return func;
    }
    await delay(100);
  }
}

async function _eval(t: any, funcStr: string, data: any) {
  const func = await getFunc(funcStr, 'eval');
  const re = await func({ R, delay }, data);
  func.destroy();
  return re;
}

export { _eval as eval };
