import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import cors from 'cors';
import expressWs from 'express-ws';
import dayjs from 'dayjs';
import { EventEmitter } from 'events';
import { DataMessage, Message, PayloadMessage } from '@/browser/socket/type';
import { Payload } from '@/browser/executor/type';

const appBase = express();
appBase.use(cors());
const { app } = expressWs(appBase);

// parse application/json
app.use(express.json({ limit: '10mb' }));



const eventEmit = new EventEmitter();
app.ws('/exec', function (ws, req) {
  ws.on('message', (msg: string) => {
    // resolve(JSON.parse(msg));
    const message: Message = JSON.parse(msg);
    // console.log(msg);
    function send(message: PayloadMessage): Promise<Message> {
      return new Promise((resolve) => {
        const _ws = ws as unknown as WebSocket
        _ws.send(JSON.stringify(message));
        const li = (evt: MessageEvent<string>) => {
          const data = JSON.parse(evt.data) as Message
          if (data.id === message.id) {
            resolve(data);
            _ws.removeEventListener('message', li);
          }
        };
        _ws.addEventListener('message', li);
      });
    }
    eventEmit.emit('message', { send, message });
  });
});

export function useCallBack(
  cb: ({ send, message }: { send: (message: Message) => Promise<Message>; message: Message }) => {}
) {
  eventEmit.addListener('message', cb);
}

app.listen(8998);
console.log('服务在8998端口');
