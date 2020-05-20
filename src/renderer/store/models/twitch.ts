import { TwitchAccessToken } from "common/types";
import { createModel } from "@rematch/core";
import { produce } from "immer";

import { fetchTwitchAuthToken, signOutTwitch } from "../../lib/twitch";

export interface TwitchClip {
    clipID: string;
    timestamp: number;
}

export interface TwitchState {
    accessToken: TwitchAccessToken | null;
    clips: { [ clipID: string ]: TwitchClip };
}

const initialState: TwitchState = {
    accessToken: null,
    clips: {},
};

export const twitch = createModel({
    state: initialState,
    reducers: {
        setAccessToken: (state: TwitchState, payload: TwitchAccessToken | null): TwitchState =>
            produce(state, draft => {
                draft.accessToken = payload;
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
            const scopes = ["user_read", "clips:edit", "chat:read", "chat:edit"];
            console.log(`fetching twitch token with the following scopes: ${scopes}`);
            const token = await fetchTwitchAuthToken(scopes);
            console.log("got back token:");
            console.log(token);
            dispatch.twitch.setAccessToken(token);
        },
        async logOutTwitch() {
            await signOutTwitch();
            dispatch.twitch.setAccessToken(null);
        },
    }),
});
