import { createModel } from '@rematch/core';

export type SharksState = number;

export const sharks = createModel({
    state: 0,
    reducers: {
        increment: (state: SharksState, payload: number): SharksState => state + payload,
        decrement: (state: SharksState, payload: number): SharksState => state - payload
    },
    effects: {
        // TODO: Optional args breaks TypeScript autocomplete (e.g. payload: number = 1)
        async incrementAsync(payload: number) {
            await delay(500);
            this.increment(payload || 1);
        }
    }
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
