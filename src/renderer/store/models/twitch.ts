import { createModel } from "@rematch/core";
import { produce } from "immer";

export interface TwitchClip {
    clipID: string;
    timestamp: number;
}

export interface TwitchState {
    clips: { [ clipID: string ]: TwitchClip };
}

const initialState: TwitchState = {
    clips: {},
};

export const twitch = createModel({
    state: initialState,
    reducers: {
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
});
