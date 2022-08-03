let wsList: { id: string; ws: WebSocket }[] = [];

export function getWsById(id: string) {
  return wsList.find((d) => d.id === id);
}

export function getWs(){
  return wsList[0]
}
export function getWsCount(){
  return wsList.length
}
function removeWs(id:string) {
  wsList = wsList.filter(w => w.id !== id)
}

export function addWs(ws: WebSocket, id: string) {
  ws.__webSocketId__ = id;
  const d = getWsById(id);
  if (d) {
    d.ws = ws;
    // 链接断开后，自动注销
    d.ws.addEventListener('close', () => {
      removeWs(id)
    })
    return;
  }
  wsList = [...wsList, { ws, id }];
}
