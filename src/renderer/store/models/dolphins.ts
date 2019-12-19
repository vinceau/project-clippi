import { createModel } from "@rematch/core";

import { delay } from "../../lib/utils";

export type DolphinsState = number;

export const dolphins = createModel({
    state: 10,
    reducers: {
        increment: (state: DolphinsState) => state + 1,
    },
    effects: dispatch => ({
        async incrementAsync() {
            await delay(500);
            dispatch.dolphins.increment();
        },
    }),
});
