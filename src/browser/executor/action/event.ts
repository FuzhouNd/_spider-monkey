import { getFunc } from './func';
import { delay } from '@/utils/index';
export function input(dom: HTMLInputElement, v: string) {
  dom.value = v;
  dom.dispatchEvent(new InputEvent('input', { inputType: 'insert', data: '' }));
}
export async function click(dom: HTMLInputElement, isReadyFuncStr?: string) {
  dom.click();
  if (!isReadyFuncStr) {
    return;
  }
  const isReadyFunc = await getFunc(isReadyFuncStr);
  let index = 0;
  const MAX = 3;
  while (index < MAX) {
    await delay(1000);
    const isReady = await isReadyFunc(window);
    if (isReady) {
      return;
    }
    index += 1;
  }
}
