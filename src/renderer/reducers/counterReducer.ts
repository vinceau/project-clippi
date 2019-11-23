import { Reducer } from 'redux';

import { DECREMENT, INCREMENT, CounterAction } from '../actions/counterActions';

export interface CounterState {
    readonly value: number;
}

const defaultState: CounterState = {
    value: 0
};

export const counterReducer: Reducer<CounterState> = (
    state = defaultState,
    action: CounterAction
) => {
    switch (action.type) {
        case INCREMENT:
            console.log('increment');
            return {
                ...state,
                value: state.value + 1
            };
        case DECREMENT:
            console.log('decrement');
            return {
                ...state,
                value: state.value - 1
            };
        default:
            return state;
    }
};
