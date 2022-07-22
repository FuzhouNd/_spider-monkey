/**
 * 
 * @param n 默认值6000
 * @returns 
 */
export function delay(n = 6 * 1000) {
  return new Promise<void>((res) => {
    setTimeout(() => {
      res();
    }, n);
  });
}
