// import { send } from '@/server';
import { useCallBack } from '@/server/index';

useCallBack(async (send) => {
  const data = await send([
    { action: ['document'], params: [] },
    { action: ['querySelector'], params: ['div'] },
    { action: ['textContent'], params: [] },
  ]);
  console.log(data);
});
