import { init, RematchRootState } from "@rematch/core";
import createRematchPersist, { getPersistor } from "@rematch/persist";

import * as models from "./models";

const persistPlugin = createRematchPersist({
    version: 1,
    blacklist: ["tempContainer"],
});

export const store = init({
    models,
    plugins: [persistPlugin],
});

export const dispatcher = store.dispatch;

export const persistor = getPersistor();
export type Store = typeof store;
export type Dispatch = typeof store.dispatch;
export type iRootState = RematchRootState<typeof models>;

export const Models = models;
