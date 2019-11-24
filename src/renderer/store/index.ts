import { init, RematchRootState } from '@rematch/core';
import * as models from './models';
import createRematchPersist, { getPersistor } from '@rematch/persist';

const persistPlugin = createRematchPersist({
    version: 1
});

export const store = init({
    models,
    plugins: [persistPlugin]
});

export const persistor = getPersistor();

export const { dispatch } = store;

export type models = typeof models;
export type Store = typeof store;
export type Dispatch = typeof store.dispatch;
export type iRootState = RematchRootState<typeof models>;
