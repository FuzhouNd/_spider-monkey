import { exec } from './message';

async function open(ws: WebSocket, url: string) {
  await exec(ws, () => {
    const id = new Date().valueOf().toString()
    window.open(url, id);
  });

}
