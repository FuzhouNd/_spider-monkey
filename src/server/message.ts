import { MESSAGE_TYPE } from '@/browser/enum';
import { DataMessage, Message, PayloadMessage } from '@/browser/socket/type';

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
      if (data.id === message.id) {
        resolve(data);
        ws.removeEventListener('message', li);
      }
    };
    ws.addEventListener('message', li);
  });
}
export async function exec<T extends (...args: any) => any>(ws: WebSocket, func: T, _data?: any): Promise<ReturnType<T>> {
  const data = await send(ws, {
    id: new Date().valueOf().toString(),
    type: MESSAGE_TYPE.payload,
    data: [{ action: 'eval', params: [func.toString(), _data] }],
  });
  return data.data;
}
export async function execList<T extends (...args: any) => any>(ws: WebSocket, func: T[], _data?: any): Promise<ReturnType<T>> {
  const data = await send(ws, {
    id: new Date().valueOf().toString(),
    type: MESSAGE_TYPE.payload,
    data: [{ action: 'eval', params: [func.toString(), _data] }],
  });
  return data.data;
}
