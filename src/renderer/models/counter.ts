import { Model } from '@rematch/core';

export const count: Model = {
    name: 'counter',
    state: 0,
    reducers: {
        increment: state => state + 1,
        decrement: state => state - 1
    },
    effects: {
        incrementIfOdd(payload, state) {
            if (state.count % 2) {
                this.increment();
            }
        },
        incrementAsync() {
            setTimeout(() => {
                this.increment();
            }, 1000);
        }
    }
};
