import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import cors from 'cors';
import expressWs from 'express-ws';
import dayjs from 'dayjs';
import { EventEmitter } from 'events';
import { DataMessage, Message, PayloadMessage, InitMessage } from '@/browser/socket/type';
import { Payload } from '@/browser/executor/type';
import { send, exec } from './message';
import { MESSAGE_TYPE } from '@/browser/enum';

const appBase = express();
appBase.use(cors());
const { app } = expressWs(appBase);

// parse application/json
// app.use(express.json({ limit: '10mb' }));

const eventEmit = new EventEmitter();
app.ws('/exec', function (ws, req) {
  ws.on('message', (msg: string) => {
    const message: Message = JSON.parse(msg);
    if (message.type === MESSAGE_TYPE.init) {
      // 回复运行时，后端准备ok
      ws.send(JSON.stringify({ id: message.id, data: true, type: MESSAGE_TYPE.data }));
      // 调用注册的函数
      eventEmit.emit('init', { ws, message });
    }
  });
});
type CB = (params: { ws: WebSocket; message: InitMessage }) => void;

export function useCallBack(cb: CB) {
  eventEmit.addListener('init', cb);
}
const PORT = 8998;
app.listen(PORT);
console.log(`服务器监听在${PORT}端口`);
