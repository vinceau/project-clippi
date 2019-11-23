import { Reducer } from 'redux';
import { produce } from 'immer';

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
) =>
    produce(state, draft => {
        switch (action.type) {
            case INCREMENT:
                console.log('increment');
                draft.value += 1;
                break;
            case DECREMENT:
                console.log('decrement');
                draft.value -= 1;
                break;
        }
    });
