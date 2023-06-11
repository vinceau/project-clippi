import { createModel } from "@rematch/core";
import type { TwitchClip } from "common/types";
import { produce } from "immer";

interface TwitchClipMap {
  [clipID: string]: TwitchClip;
}

export interface TwitchState {
  clips: TwitchClipMap;
  reconnectTwitch: boolean;
}

const initialState: TwitchState = {
  clips: {},
  reconnectTwitch: false,
};

export const twitch = createModel({
  state: initialState,
  reducers: {
    setReconnectTwitch: (state: TwitchState, payload: boolean): TwitchState =>
      produce(state, (draft) => {
        draft.reconnectTwitch = payload;
      }),
    addTwitchClip: (state: TwitchState, payload: TwitchClip): TwitchState => {
      const clips = produce(state.clips, (draft) => {
        draft[payload.clipID] = payload;
      });
      return produce(state, (draft) => {
        draft.clips = clips;
      });
    },
    removeTwitchClip: (state: TwitchState, payload: string): TwitchState => {
      const clips = produce(state.clips, (draft) => {
        delete draft[payload];
      });
      return produce(state, (draft) => {
        draft.clips = clips;
      });
    },
    clearAllTwitchClips: (state: TwitchState): TwitchState => {
      return produce(state, (draft) => {
        draft.clips = {};
      });
    },
  },
});
