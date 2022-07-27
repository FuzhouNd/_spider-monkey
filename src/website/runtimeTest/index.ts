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
        { action: ACTION.querySelector, params: ['#sb_form_q'] },
        { action: ACTION.input, params: ['你好'] },
        { action: ACTION.querySelector, params: ['#sb_form_go'] },
        { action: 'click', params: [] },
      ],
      id: new Date().valueOf().toString(),
    });
    // data.data
  }
});
