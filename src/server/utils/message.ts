import { MESSAGE_TYPE } from '@/browser/enum';
import { DataMessage, Message, PayloadMessage } from '@/browser/socket/type';
import * as R from 'ramda';
import { delay } from '@/utils';

export function send(ws: WebSocket, message: PayloadMessage): Promise<DataMessage> {
  return new Promise((resolve) => {
    // 把入参处理下
    if (Array.isArray(message.data)) {
      message.data = message.data.map((item) => {
        return {
          ...item,
          params: item.params.map((p) => {
            if (typeof p === 'function') {
              return p.toString();
            }
            return p;
          }),
        };
      });
    } else {
      message.data.params = message.data.params.map((p) => {
        if (typeof p === 'function') {
          return p.toString();
        }
        return p;
      });
    }
    ws.send(JSON.stringify(message));
    const li = (evt: MessageEvent<string>) => {
      const data = JSON.parse(evt.data) as DataMessage;
      if (data.messageId === message.messageId) {
        resolve(data);
        ws.removeEventListener('message', li);
      }
    };
    ws.addEventListener('message', li);
  });
}

type Func<T> = (G: { R: typeof R; delay: typeof delay }, data: T) => any;
// 在浏览器上执行代码
export async function exec<K, T extends Func<K>>(ws: WebSocket, func: T, _data?: K): Promise<ReturnType<T>> {
  const data = await send(ws, {
    messageId: new Date().valueOf().toString(),
    type: MESSAGE_TYPE.payload,
    data: [{ action: 'eval', params: [func.toString(), _data] }],
    webSocketId: ws.__webSocketId__ || '',
  });
  return data.data;
}
