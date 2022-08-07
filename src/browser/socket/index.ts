import { execPayload } from '@/browser/executor/index';
import { MESSAGE_TYPE } from '@/browser/enum';
import type { InitMessage, Message, PayloadMessage, DataMessage } from './type';
import { Payload } from '@/browser/executor/type';

const VITE_EXPORT_NAME = import.meta.env.VITE_EXPORT_NAME;
// @ts-ignore
let socket: WebSocket | undefined = window[VITE_EXPORT_NAME];
let webSocketId: string = '';

function sendMessage(message: Message): Promise<DataMessage> {
  return new Promise((resolve, reject) => {
    if (socket) {
      if (message.type === MESSAGE_TYPE.data) {
        socket.send(JSON.stringify(message));
        resolve(message);
        return;
      }
      if (message.type === MESSAGE_TYPE.init || message.type === MESSAGE_TYPE.payload) {
        const li = (evt: MessageEvent) => {
          const data = JSON.parse(evt.data);
          if (data?.messageId === message.messageId) {
            resolve(data);
            if (socket) {
              socket?.removeEventListener('message', li);
            }
          }else {
            reject(Error('初始化失败'))
          }
        };
        socket.addEventListener('message', li);
        socket.send(JSON.stringify(message));
        return;
      }
      return;
    }
    reject('need init socket');
  });
}

async function initMessage() {
  const webSocketId = new URL(location.href).searchParams.get('webSocketId') || window.name;
  const data = await sendMessage({
    type: MESSAGE_TYPE.init,
    content: { url: location.href },
    messageId: new Date().valueOf().toString(),
    webSocketId,
  });
  if (data) {
    const resWebSocketId = data.webSocketId;
    console.log('runtime init success', 'res', resWebSocketId, 'brow', webSocketId);
  } else {
    throw Error('runtime init fail');
  }
}

async function onPayloadMessage() {
  if (socket) {
    const li = async (evt) => {
      const message: PayloadMessage = JSON.parse(evt.data);
      console.log(message, 'message');
      if (message.type === MESSAGE_TYPE.payload) {
        const data = await execPayload(message.data);
        sendMessage({ type: MESSAGE_TYPE.data, data, messageId: message.messageId, webSocketId });
      }
    };
    socket.addEventListener('message', li);
  } else {
    throw Error('need init socket');
  }
}

async function initSocket() {
  if (!socket) {
    const host = location.host;
    // @ts-ignore
    socket = new WebSocket(`ws://127.0.0.1:8998/spider-runtime`);
    // @ts-ignore
    window[VITE_EXPORT_NAME] = socket;
    socket.addEventListener('open', async () => {
      // 监听消息，执行payload
      await initMessage();
      onPayloadMessage();
    });
    socket.addEventListener('close', () => {
      //@ts-ignore
      window[VITE_EXPORT_NAME] = void 0;
      console.log(new Date().toLocaleString(), 'socket close');
    });
    return;
  }
  // 发送初始化消息，告诉后台目前的运行时状态
  await initMessage();
}

export { initSocket };
