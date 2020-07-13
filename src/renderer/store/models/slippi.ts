import produce from "immer";

import { createModel } from "@rematch/core";

import { mapFilterSettingsToConfiguration } from "@/lib/profile";
import { comboFilter, streamManager } from "@/lib/realtime";
import { notify } from "@/lib/utils";

export const DEFAULT_PROFILE = "default";

export interface SlippiState {
  port: string;
  currentProfile: string; // profile name
  comboProfiles: { [name: string]: string }; // profile name -> JSON stringified settings
  obsAddress: string;
  obsPort: string;
  obsPassword: string;
}

const defaultSettings = JSON.stringify(mapFilterSettingsToConfiguration(comboFilter.getSettings()));

const initialState: SlippiState = {
  port: "1667",
  currentProfile: DEFAULT_PROFILE,
  comboProfiles: {
    [DEFAULT_PROFILE]: defaultSettings,
  },
  obsAddress: "localhost",
  obsPort: "4444",
  obsPassword: "",
};

export const slippi = createModel({
  state: initialState,
  reducers: {
    setOBSAddress: (state: SlippiState, payload: string): SlippiState => {
      return produce(state, (draft) => {
        draft.obsAddress = payload;
      });
    },
    setOBSPort: (state: SlippiState, payload: string): SlippiState => {
      return produce(state, (draft) => {
        draft.obsPort = payload;
      });
    },
    setOBSPassword: (state: SlippiState, payload: string): SlippiState => {
      return produce(state, (draft) => {
        draft.obsPassword = payload;
      });
    },
    setPort: (state: SlippiState, payload: string): SlippiState => {
      console.log(`setting port to ${payload}`);
      return produce(state, (draft) => {
        draft.port = payload;
      });
    },
    setCurrentProfile: (state: SlippiState, payload: string): SlippiState => {
      const newProfile = !Object.keys(state.comboProfiles).includes(payload);
      const newComboProfiles = produce(state.comboProfiles, (draft) => {
        if (newProfile) {
          draft[payload] = draft[state.currentProfile];
        }
      });
      return produce(state, (draft) => {
        draft.currentProfile = payload;
        draft.comboProfiles = newComboProfiles;
      });
    },
    saveProfile: (state: SlippiState, payload: { name: string; settings: string }): SlippiState => {
      const newState = produce(state.comboProfiles, (draft) => {
        draft[payload.name] = payload.settings;
      });
      return produce(state, (draft) => {
        draft.comboProfiles = newState;
      });
    },
    deleteProfile: (state: SlippiState, payload: string): SlippiState => {
      const newState = produce(state.comboProfiles, (draft) => {
        if (payload !== DEFAULT_PROFILE) {
          delete draft[payload];
        } else {
          draft[DEFAULT_PROFILE] = defaultSettings;
        }
      });
      return produce(state, (draft) => {
        draft.currentProfile = DEFAULT_PROFILE;
        draft.comboProfiles = newState;
      });
    },
  },
  effects: (dispatch) => ({
    async connectToSlippi(port: string) {
      try {
        console.log(`connecting on port: ${port}`);
        await streamManager.connectToSlippi(parseInt(port, 10));
      } catch (err) {
        console.error(err);
        notify(`Failed to connect to port ${port}! Is the relay running?`);
      }
      dispatch.slippi.setPort(port);
    },
  }),
});
