import { createModel } from "@rematch/core";
import { produce } from "immer";

import { fetchTwitchAuthToken, signOutTwitch } from "@/lib/twitch";

export interface TwitchClip {
    clipID: string;
    timestamp: number;
}

export interface TwitchState {
    authToken: string;
    clips: { [ clipID: string ]: TwitchClip };
}

const initialState: TwitchState = {
    authToken: "",
    clips: {},
};

export const twitch = createModel({
    state: initialState,
    reducers: {
        setAuthToken: (state: TwitchState, payload: string): TwitchState =>
            produce(state, draft => {
                draft.authToken = payload;
            }),
        addTwitchClip: (state: TwitchState, payload: TwitchClip): TwitchState => {
            const clips = produce(state.clips, draft => {
                draft[payload.clipID] = payload;
            });
            return produce(state, draft => {
                draft.clips = clips;
            });
        },
        removeTwitchClip: (state: TwitchState, payload: string): TwitchState => {
            const clips = produce(state.clips, draft => {
                delete draft[payload];
            });
            return produce(state, draft => {
                draft.clips = clips;
            });
        },
    },
    effects: dispatch => ({
        async fetchTwitchToken() {
            const scopes = ["user_read", "clips:edit"];
            console.log(`fetching twitch token with the following scopes: ${scopes}`);
            const token = await fetchTwitchAuthToken(scopes);
            console.log(`got back token: ${token}`);
            dispatch.twitch.setAuthToken(token);
        },
        async logOutTwitch() {
            await signOutTwitch();
            dispatch.twitch.setAuthToken("");
        },
    }),
});
