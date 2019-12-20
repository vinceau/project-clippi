import { createModel } from "@rematch/core";

import produce from "immer";

export interface SlippiState {
    port: number;
}

const initialState: SlippiState = {
    port: 1667,
};

export const slippi = createModel({
    state: initialState,
    reducers: {
        setPort: (state: SlippiState, payload: number | string): SlippiState => produce(state, draft => {
            let port: number;
            if (typeof payload === "number") {
                port = payload;
            } else {
                port = parseInt(payload, 10);
            }
            // Make sure it's a valid port
            if (port > 0) {
                state.port = port;
            }
        }),
    },
});
