import { Store } from 'tauri-plugin-store-api';

import { UserStore } from '@/lib/types/storage';

const store = new Store('user.store');

export const getUser = async () =>
    (await store.get<UserStore['user']>('user')) || null;

export const setUser = async (user: UserStore['user']) => {
    await store.set('user', user);
    await store.save();
    return user;
};

export const removeUser = async () => {
    await store.clear();
    await store.save();
};
