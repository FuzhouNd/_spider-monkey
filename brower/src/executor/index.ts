import { path } from 'ramda';
export type Payload = {
  action: string[];
  params: any[];
};

type Re = { data: any };
async function exec(payloadList: Payload[]): Promise<Re> {
  // 上下文
  let context: any = window;
  for (const payload of payloadList) {
    const { action, params } = payload;
    const _context = path(action, context);
    console.log(_context, params);
    if (typeof _context === 'function') {
      context = await _context(...params);
    } else {
      context = _context;
    }
  }
  return { data: context };
}

export { exec };
