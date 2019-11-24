import { createModel } from '@rematch/core';
import { fetchTwitchAuthToken } from '../../lib/events';
import { produce } from 'immer';

export interface TwitchState {
    authToken: string;
}

const initialState: TwitchState = {
    authToken: ''
};

export const twitch = createModel({
    state: initialState,
    reducers: {
        setAuthToken: (state: TwitchState, payload: string): TwitchState =>
            produce(state, draft => {
                draft.authToken = payload;
            })
    },
    effects: {
        async fetchTwitchToken(scopes: string | string[]) {
            console.log(`fetching twitch token with the following scopes: ${scopes}`);
            const token = await fetchTwitchAuthToken(scopes);
            console.log(`got back token: ${token}`);
            this.setAuthToken(token);
        }
    }
});
