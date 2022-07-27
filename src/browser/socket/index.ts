import { exec } from '@/browser/executor/index';
import { MESSAGE_TYPE } from '@/browser/enum';
import type {  Message } from './type';
import { Payload } from '@/browser/executor/type';

const VITE_EXPORT_NAME = import.meta.env.VITE_EXPORT_NAME;
// @ts-ignore
let socket: WebSocket | undefined = window[VITE_EXPORT_NAME];

function sendMessage(message: Message): Promise<Payload | Payload[]> {
  return new Promise((resolve, reject) => {
    if (socket) {
      socket.send(JSON.stringify(message));
      const li = (evt: MessageEvent) => {
        if (evt.data?.id === message.id) {
          resolve(JSON.parse(evt.data));
          if (socket) {
            socket?.removeEventListener('message', li);
          }
        }
      };
      socket.addEventListener('message', li);
    } else {
      reject('need init socket');
    }
  });
}

async function sendInitMessage() {
  const payload = await sendMessage({
    type: MESSAGE_TYPE.init,
    content: { url: location.href },
    id: new Date().valueOf().toString(),
  });
  const data = await exec(payload);
  await sendMessage({ type: MESSAGE_TYPE.data, data, content: { url: location.href }, id: new Date().valueOf().toString() });
  console.log('runtime init success');
}

async function onMessage() {
  return new Promise((resolve, reject) => {
    if (socket) {
      const li = async (evt) => {
        const message: Message = JSON.parse(evt.data);
        if (message.type === MESSAGE_TYPE.payload) {
          const data = await exec(message.data);
          sendMessage({ type: MESSAGE_TYPE.data, data, id: message.id });
          resolve(true);
        }
      };
      socket.addEventListener('message', li);
    } else {
      reject('need init socket');
    }
  });
}

async function initSocket() {
  if (!socket) {
    // @ts-ignore
    socket = new WebSocket('ws://127.0.0.1:8998/exec');
    // @ts-ignore
    window[VITE_EXPORT_NAME] = socket;
    socket.addEventListener('open', () => {
      // 监听消息，执行payload
      onMessage();
      sendInitMessage();
    });
    socket.addEventListener('close', () => {
      //@ts-ignore
      window[VITE_EXPORT_NAME] = void 0;
      console.log('socket close');
    });
    return;
  }
  // 发送初始化消息，告诉后台目前的运行时状态
  await sendInitMessage();
}

export { initSocket };
