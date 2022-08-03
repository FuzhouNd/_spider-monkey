import { exec } from './message';
import { getWsById, getWs } from './wsStore';
import { delay } from '@/utils/index';

export function createPage(url: string): Promise<{ ws: WebSocket; webSocketId: string }> {
  return new Promise(async (resolve, reject) => {
    const rootWs = getWs()?.ws;
    if (!rootWs) {
      reject(false);
      return;
    }
    const resWebSocketId = await exec(
      rootWs,
      ({}, url) => {
        const webSocketId = new Date().valueOf().toString();
        window.open(url, webSocketId);
        return webSocketId;
      },
      url
    );
    const Max = 3;
    let index = 0;
    while (true) {
      await delay(1000);
      const ws = getWsById(resWebSocketId);
      if (ws) {
        resolve({ ws: ws.ws, webSocketId: resWebSocketId });
        break;
      } else if (index > Max) {
        reject('can find ws');
        break;
      }
      index += 1;
    }
  });
}
