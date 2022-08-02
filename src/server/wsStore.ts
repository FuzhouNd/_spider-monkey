let wsList: { id: string; ws: WebSocket }[] = [];

export function getWsById(id: string) {
  return wsList.find((d) => d.id === id);
}

export function getWs(){
  return wsList[0]
}

export function addWs(ws: WebSocket, id: string) {
  ws.__webSocketId__ = id;
  const d = getWsById(id);
  if (d) {
    d.ws = ws;
    return;
  }
  wsList = [...wsList, { ws, id }];
}
