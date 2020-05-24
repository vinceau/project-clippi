import { TwitchClip } from "common/types";

import { createModel } from "@rematch/core";
import { produce } from "immer";

interface TwitchClipMap {
    [ clipID: string ]: TwitchClip;
}

export interface TwitchState {
    clips: TwitchClipMap;
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
