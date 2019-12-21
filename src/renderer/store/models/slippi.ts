import { createModel } from "@rematch/core";

import produce from "immer";

export interface SlippiState {
    port: string;
    settings: string; // JSON stringified settings
}

const initialState: SlippiState = {
    port: "",
    settings: "{}",
};

export const slippi = createModel({
    state: initialState,
    reducers: {
        setPort: (state: SlippiState, payload: string): SlippiState => produce(state, draft => {
            draft.port = payload;
        }),
        updateSettings: (state: SlippiState, payload: string): SlippiState => produce(state, draft => {
            draft.settings = payload;
        }),
    },
});
