import { MESSAGE_TYPE } from '@/browser/enum';
import type { Payload } from '@/browser/executor/type';

type Content = { url: string };

export interface PayloadMessage {
  // 消息类型
  type: MESSAGE_TYPE.payload;
  // 消息上下文
  content?: Content;
  data: Payload | Payload[];
  id: string;
}
export interface InitMessage {
  // 消息类型
  type: MESSAGE_TYPE.init;
  // 消息上下文
  content: Content;
  id: string;
}
export interface DataMessage {
  // 消息类型
  type: MESSAGE_TYPE.data;
  // 消息上下文
  content?: Content;
  data: any;
  id: string;
}
export interface StoreMessage {
  // 消息类型
  type: MESSAGE_TYPE.store;
  // 消息上下文
  content?: Content;
  data: any;
  id: string;
}

export type Message = PayloadMessage | InitMessage | DataMessage;
