// 一个简单的状态管理，用于浏览器与服务器的状态同步
type O = { [key: string]: any };
import {} from '@/server/message';
function createStore() {
  return {
    store: {} as O,
    set(v: O) {
      this.store = { ...this.store, ...v };
    },
  };
}

export const store = createStore()