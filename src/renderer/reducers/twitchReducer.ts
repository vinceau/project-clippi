import { Reducer } from 'redux';
import { TwitchAction, TwitchSetToken } from '../actions/twitchActions';

export interface TwitchState {
    readonly accessToken: string | null;
}

const defaultState: TwitchState = {
    accessToken: null
};

export const twitchReducer: Reducer<TwitchState, TwitchAction> = (
    state = defaultState,
    action: TwitchAction
) => {
    switch (action.type) {
        case TwitchSetToken:
            return {
                ...state,
                accessToken: action.accessToken
            };
        default:
            return state;
    }
};
