import { delay } from '@/utils';
import { url } from 'inspector';

export type WsObj = { id: string; ws: WebSocket; url: string }
let wsList: WsObj[] = [];

export function getWsById(id: string) {
  return wsList.find((d) => d.id === id);
}
export function getAllWs() {
  return wsList;
}
export async function waitForWs(func: (wsObj: { id: string; ws: WebSocket; url: string }) => boolean) {
  for (let index = 0; index < 5; index++) {
    await delay(1000);
    const ws = getAllWs().find(func);
    if (ws) {
      return ws;
    }
  }
  return void 0;
}
export function getWs() {
  return wsList[0];
}
export function getWsCount() {
  return wsList.length;
}
export function removeWs(id: string) {
  wsList = wsList.filter((w) => w.id !== id);
}

export function addWs(ws: WebSocket, info: { id: string; url: string }) {
  ws.__webSocketId__ = info.id;
  ws.addEventListener('close', ()=>{
    removeWs(info.id)
  })
  removeWs(info.id)
  wsList = [...wsList, { ws, ...info }];
}
