// import { send } from '@/server';
import { ACTION, MESSAGE_TYPE } from '@/browser/enum';
import { useCallBack } from '@/server/index';

function funcToString(func: Function) {
  return func.toString();
}

useCallBack(async ({ send, message }) => {
  if (message.type === MESSAGE_TYPE.init) {
    const data = await send({
      type: MESSAGE_TYPE.payload,
      data: [
        {
          action: 'eval',
          params: [
           () => {
              return [...document.querySelectorAll('a')].map((d) => d.textContent);
            },
          ],
        },
      ],
      id: new Date().valueOf().toString(),
    });
    console.log(data, 'data');
    // data.data
  }
});
