import { exec } from './message';
import { getWsById, getWs, WsObj } from './wsStore';
import { delay } from '@/utils/index';

// 新创一个页面
export function createPage(url: string, options?: { noWait: boolean }): Promise<WsObj> {
  return new Promise(async (resolve, reject) => {
    const parsedUrl = new URL(url);
    const rootWs = getWs()?.ws;
    const webSocketId = new Date().valueOf().toString();
    parsedUrl.searchParams.append('webSocketId', webSocketId);
    url = parsedUrl.toString();
    if (!rootWs) {
      reject('createPage fail,because need root ws');
      return;
    }
    const resWebSocketId = await exec(
      rootWs,
      ({}, { url, webSocketId }) => {
        window.open(url, webSocketId);
        return webSocketId;
      },
      { url, webSocketId }
    );
    if (options?.noWait) {
      resolve({ id: '', ws: {} as unknown as WebSocket, url: '' });
    }
    const Max = 10;
    let index = 0;
    while (true) {
      await delay(1000);
      const ws = getWsById(resWebSocketId);
      if (ws) {
        resolve(ws);
        break;
      } else if (index > Max) {
        reject('createPage fail,because can not link to that page');
        break;
      }
      index += 1;
    }
  });
}
