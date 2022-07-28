import { delay } from '@/utils';
import R from 'ramda';

export type Payload = {
  action: string;
  params: any[];
};

export type ActionMap = {
  [key: string]: (context: unknown, ...params: unknown[]) => unknown;
};

export type ExecFuncParams = { delay: typeof delay; R: typeof R; data: unknown };
