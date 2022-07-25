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

export function deleteSemi(params:string) {
  return params.replace(/[;]/g, '；')
}
export function deleteRF(params:string) {
  return params.replace(/[\s]/g, ' ')
}