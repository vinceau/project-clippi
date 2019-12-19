import { createModel } from "@rematch/core";

import { delay } from "../../lib/utils";

export type SharksState = number;

export const sharks = createModel({
    state: 2,
    reducers: {
        increment: (state: SharksState, payload: number): SharksState =>
            state + payload,
    },
    effects: dispatch => ({
        // TODO: Optional args breaks TypeScript autocomplete (e.g. payload: number = 1)
        async incrementAsync(payload: number) {
            await delay(500);
            dispatch.sharks.increment(payload || 1);
        },
    }),
});
