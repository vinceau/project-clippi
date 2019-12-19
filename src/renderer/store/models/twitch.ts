import { createModel } from "@rematch/core";
import { produce } from "immer";
import { fetchTwitchAuthToken } from "../../lib/twitch";

export interface TwitchState {
    authToken: string;
}

const initialState: TwitchState = {
    authToken: ""
};

export const twitch = createModel({
    state: initialState,
    reducers: {
        setAuthToken: (state: TwitchState, payload: string): TwitchState =>
            produce(state, draft => {
                draft.authToken = payload;
            })
    },
    effects: dispatch => ({
        async fetchTwitchToken(scopes: string | string[]) {
            console.log(`fetching twitch token with the following scopes: ${scopes}`);
            const token = await fetchTwitchAuthToken(scopes);
            // await delay(2000);
            // const token = "abc";
            console.log(`got back token: ${token}`);
            dispatch.twitch.setAuthToken(token);
        },
    }),
});
