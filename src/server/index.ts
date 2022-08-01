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
import { addWs } from './wsStore';

const appBase = express();
appBase.use(cors());
const { app } = expressWs(appBase);

// parse application/json
// app.use(express.json({ limit: '10mb' }));

function heartBeat(ws: WebSocket) {
  setInterval(async () => {
    const dateStr = await exec(ws, () => new Date().toLocaleString());
  }, 30 * 1000);
}

const eventEmit = new EventEmitter();
app.ws('/spider-runtime', function (ws, req) {
  ws.on('message', (msg: string) => {
    const message: Message = JSON.parse(msg);
    if (message.type === MESSAGE_TYPE.init) {
      // 回复运行时，后端准备ok
      const webSocketId = message.webSocketId || new Date().valueOf().toString();
      ws.send(JSON.stringify({ messageId: message.messageId, data: true, type: MESSAGE_TYPE.data, webSocketId }));
      addWs(ws as unknown as WebSocket, webSocketId);
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
