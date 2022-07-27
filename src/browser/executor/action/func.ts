import { FUNC_PREFIX } from '@/browser/enum';
import { delay } from '@/utils';

interface ExecFunc {
  (...args: any[]): any;
  destroy: () => void;
}

export async function getFunc(funcStr = ''): Promise<ExecFunc> {
  const sc = document.createElement('script');
  const varName = `${FUNC_PREFIX}_map`;
  sc.innerHTML = `window.${varName} = ${funcStr};`;
  document.body.append(sc);
  while (true) {
    const func = window[varName];
    if(func){
      func.destroy = () => {
        window[varName] = void 0;
        sc.remove();
      };
      return func;
    }
    await delay(100)
  }
}

export async function map(t: any, funcStr = '') {
  const func = await getFunc(funcStr);
  const re = t.map((...params) => {
    return func(...params);
  });
  func.destroy();
  return re;
}
