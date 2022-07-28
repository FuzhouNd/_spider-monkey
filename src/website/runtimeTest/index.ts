// import { send } from '@/server';
import { useCallBack } from '@/server/index';
import { exec } from '@/server/message';


useCallBack(async ({ ws, message }) => {
  const data = await exec(ws, () => {
    return [...document.querySelectorAll('a')].map((d) => d.textContent);
  });
  console.log(data);
  // data.data
});
