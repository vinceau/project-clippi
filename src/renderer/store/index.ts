import { init, RematchRootState } from '@rematch/core';
import * as models from './models';
import createRematchPersist from '@rematch/persist';

const persistPlugin = createRematchPersist({
    version: 1
});

export const store = init({
    models,
    plugins: [persistPlugin]
});

export type models = typeof models;
export type Store = typeof store;
export type Dispatch = typeof store.dispatch;
export type iRootState = RematchRootState<typeof models>;
