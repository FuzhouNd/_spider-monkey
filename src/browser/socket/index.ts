import { execPayload } from '@/browser/executor/index';
import { MESSAGE_TYPE } from '@/browser/enum';
import type { InitMessage, Message, PayloadMessage, DataMessage, StoreMessage } from './type';
import { Payload } from '@/browser/executor/type';
import { store } from '@/browser/store';

const VITE_EXPORT_NAME = import.meta.env.VITE_EXPORT_NAME;
// @ts-ignore
let socket: WebSocket | undefined = window[VITE_EXPORT_NAME];

function sendMessage(message: PayloadMessage | InitMessage): Promise<DataMessage> {
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

function sendDataMessage(message: DataMessage) {
  if (socket) {
    socket.send(JSON.stringify(message));
  } else {
    throw Error('need init socket');
  }
}

async function sendInitMessage() {
  const data = await sendMessage({
    type: MESSAGE_TYPE.init,
    content: { url: location.href },
    id: new Date().valueOf().toString(),
  });
  if (data.data) {
    console.log('runtime init success');
  } else {
    throw Error('runtime init fail');
  }
}

async function onPayloadMessage() {
  if (socket) {
    const li = async (evt) => {
      const message: PayloadMessage = JSON.parse(evt.data);
      if (message.type === MESSAGE_TYPE.payload) {
        const data = await execPayload(message.data);
        sendDataMessage({ type: MESSAGE_TYPE.data, data, id: message.id });
      }
    };
    socket.addEventListener('message', li);
  } else {
    throw Error('need init socket');
  }
}

async function initSocket() {
  if (!socket) {
    // @ts-ignore
    socket = new WebSocket('ws://127.0.0.1:8998/exec');
    // @ts-ignore
    window[VITE_EXPORT_NAME] = socket;
    socket.addEventListener('open', async () => {
      // 监听消息，执行payload
      onPayloadMessage();
      await sendInitMessage();
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
