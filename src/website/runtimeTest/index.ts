// import { send } from '@/server';
import { useCallBack } from '@/server/utils/server';
import { exec } from '@/server/utils/message';


useCallBack(async ({ ws, message }) => {
  const data = await exec(ws, () => {
    return [...document.querySelectorAll('a')].map((d) => d.textContent);
  });
  console.log(data);
  // data.data
});
