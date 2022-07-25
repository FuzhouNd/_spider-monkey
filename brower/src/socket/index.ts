import { exec } from '@/executor/index';

// @ts-ignore
const socket:WebSocket = window.__socket || new WebSocket('ws://127.0.0.1:8998/exec');

// Connection opened
// socket.addEventListener('open', function () {
// });

// Listen for messages
socket.addEventListener('message', async function (event) {
  let payload = JSON.parse(event.data);
  if (!Array.isArray(payload)) {
    payload = [payload];
  }
  const data = await exec(payload);
  console.log('data', data);
  socket.send(JSON.stringify(data));
  // console.log('Message from server ', event.data);
});

export { socket };
