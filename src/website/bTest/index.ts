// import { send } from '@/server';
import { useCallBack } from '@/server/index';

useCallBack(async (send) => {
  const data = await send([
    { action: 'querySelectorAll', params: ['div a'] },
    { action: 'textContent', params: [] },
  ]);
  console.log(data);
});
