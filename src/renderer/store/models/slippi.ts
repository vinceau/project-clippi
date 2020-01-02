import { createModel } from "@rematch/core";

import { EventActionConfig } from "@/components/Automator/Automator";

import { ActionEvent, connectToSlippi as startSlippiConnection, comboFilter } from "@/lib/realtime";
import produce from "immer";
import { notify } from "@/lib/utils";

const DEFAULT_PROFILE = "default";

export interface SlippiState {
    port: string;
    currentProfile: string; // profile name
    comboProfiles: { [name: string]: string}; // profile name -> JSON stringified settings
    events: EventActionConfig[];
}

const defaultSettings = JSON.stringify(comboFilter.getSettings());

const initialState: SlippiState = {
    port: "1667",
    currentProfile: DEFAULT_PROFILE,
    comboProfiles: {
        [DEFAULT_PROFILE]: defaultSettings,
    },
    events: [],
};

export const slippi = createModel({
    state: initialState,
    reducers: {
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
                notify("Failed to connect", `Connection on port ${port} failed! Is the relay running?`);
            }
            dispatch.slippi.setPort(port);
        },
    }),
});
