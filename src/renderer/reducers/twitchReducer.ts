import { Reducer } from 'redux';
import { TwitchAction, TwitchSetToken } from '../actions/twitchActions';
import { produce } from 'immer';

export interface TwitchState {
    readonly accessToken: string | null;
}

const defaultState: TwitchState = {
    accessToken: null
};

export const twitchReducer: Reducer<TwitchState, TwitchAction> = (
    state = defaultState,
    action: TwitchAction
) =>
    produce(state, draft => {
        switch (action.type) {
            case TwitchSetToken:
                draft.accessToken = action.accessToken;
                break;
        }
    });
