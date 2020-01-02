import { createModel } from "@rematch/core";

import { EventActionConfig } from "@/components/Automator/Automator";

import { ActionEvent, comboFilter } from "@/lib/realtime";
import produce from "immer";

export interface SlippiState {
    port: string;
    currentProfile: string; // profile name
    comboProfiles: { [name: string]: string}; // profile name -> JSON stringified settings
    events: EventActionConfig[];
}

const defaultSettings = JSON.stringify(comboFilter.getSettings());

const initialState: SlippiState = {
    port: "",
    currentProfile: "default",
    comboProfiles: {
        default: defaultSettings,
    },
    events: [],
};

export const slippi = createModel({
    state: initialState,
    reducers: {
        setPort: (state: SlippiState, payload: string): SlippiState => produce(state, draft => {
            draft.port = payload;
        }),
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
});
