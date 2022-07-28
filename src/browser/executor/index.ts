import { ActionMap, Payload } from './type';

const modules = import.meta.glob('./action/*.ts', { eager: true });

const actionMap = Object.keys(modules).reduce((re, key) => {
  const _module = modules[key] as { [key: string]: (args: unknown) => unknown };
  return { ...re, ..._module };
}, {} as ActionMap);

async function execPayload(payloadList: Payload[]|Payload) {
  let t: any = void 0;
  if(!Array.isArray(payloadList)){
    payloadList = [payloadList]
  }
  for (const payload of payloadList) {
    const { action, params } = payload;
    if (actionMap[action]) {
      t = await actionMap[action](t, ...params);
    }
  }
  return t;
}

export { execPayload };
