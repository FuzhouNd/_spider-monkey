import { store } from '@/browser/store';

export async function updateStore(t, data: { [key: string]: any }) {
  store.set(data);
  return { store: store.store, id: store.id };
}
