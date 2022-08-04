import { delay } from '@/utils';

let wsList: { id: string; ws: WebSocket; url: string }[] = [];

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
  const d = getWsById(info.id);
  if (d) {
    d.ws = ws;
    // 链接断开后，自动注销
    d.ws.addEventListener('close', () => {
      removeWs(info.id);
    });
    return;
  }
  wsList = [...wsList, { ws, ...info }];
}
