import { createModel } from "@rematch/core";

import { EventActionConfig } from "@/actions";

import { ActionEvent, comboFilter, connectToSlippi as startSlippiConnection } from "@/lib/realtime";
import { notify } from "@/lib/utils";
import produce from "immer";

const DEFAULT_PROFILE = "default";

export interface SlippiState {
    port: string;
    currentProfile: string; // profile name
    comboProfiles: { [name: string]: string}; // profile name -> JSON stringified settings
    events: EventActionConfig[];
    obsAddress: string;
    obsPort: string;
    obsPassword: string;
}

const defaultSettings = JSON.stringify(comboFilter.getSettings());

const initialState: SlippiState = {
    port: "1667",
    currentProfile: DEFAULT_PROFILE,
    comboProfiles: {
        [DEFAULT_PROFILE]: defaultSettings,
    },
    events: [],
    obsAddress: "192.168.1.118",
    obsPort: "4444",
    obsPassword: "",
};

export const slippi = createModel({
    state: initialState,
    reducers: {
        setOBSAddress: (state: SlippiState, payload: string): SlippiState => {
            return produce(state, draft => {
                draft.obsAddress = payload;
            });
        },
        setOBSPort: (state: SlippiState, payload: string): SlippiState => {
            return produce(state, draft => {
                draft.obsPort = payload;
            });
        },
        setPort: (state: SlippiState, payload: string): SlippiState => {
            console.log(`setting port to ${payload}`);
            return produce(state, draft => {
                draft.port = payload;
            });
        },
        setCurrentProfile: (state: SlippiState, payload: string): SlippiState => {
            const newProfile = !Object.keys(state.comboProfiles).includes(payload);
            const newComboProfiles = produce(state.comboProfiles, draft => {
                if (newProfile) {
                    draft[payload] = draft[state.currentProfile];
                }
            });
            return produce(state, draft => {
                draft.currentProfile = payload;
                draft.comboProfiles = newComboProfiles;
            });
        },
        saveProfile: (state: SlippiState, payload: { name: string, settings: string }): SlippiState => {
            const newState = produce(state.comboProfiles, draft => {
                draft[payload.name] = payload.settings;
            });
            return produce(state, draft => {
                draft.comboProfiles = newState;
            });
        },
        deleteProfile: (state: SlippiState, payload: string): SlippiState => {
            const newState = produce(state.comboProfiles, draft => {
                if (payload !== DEFAULT_PROFILE) {
                    delete draft[payload];
                } else {
                    draft[DEFAULT_PROFILE] = defaultSettings;
                }
            });
            return produce(state, draft => {
                draft.currentProfile = DEFAULT_PROFILE;
                draft.comboProfiles = newState;
            });
        },
        addNewEventAction: (state: SlippiState, payload: ActionEvent): SlippiState => produce(state, draft => {
            draft.events.push({
                event: payload,
                actions: [],
            });
        }),
        updateActionEvent: (state: SlippiState, payload: { index: number; event: EventActionConfig }): SlippiState => produce(state, draft => {
            draft.events[payload.index] = payload.event;
        }),
        removeActionEvent: (state: SlippiState, payload: number): SlippiState => produce(state, draft => {
            draft.events.splice(payload, 1);
        }),
    },
    effects: dispatch => ({
        async connectToSlippi(port: string) {
            try {
                console.log(`connecting on port: ${port}`);
                await startSlippiConnection(parseInt(port, 10));
            } catch (err) {
                console.error(err);
                notify(`Failed to connect to port ${port}! Is the relay running?`);
            }
            dispatch.slippi.setPort(port);
        },
    }),
});
