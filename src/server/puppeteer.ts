import { exec } from './message';

async function open(ws: WebSocket, url: string) {
  await exec(ws, () => {
    window.open(url);
  });
  
}
