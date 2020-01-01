import { createModel } from "@rematch/core";

import { EventActionConfig } from "@/components/Automator/Automator";

import { ActionEvent } from "@/lib/realtime";
import produce from "immer";

export interface SlippiState {
    port: string;
    settings: string; // JSON stringified settings
    events: EventActionConfig[];
}

const initialState: SlippiState = {
    port: "",
    settings: "{}",
    events: [],
};

export const slippi = createModel({
    state: initialState,
    reducers: {
        setPort: (state: SlippiState, payload: string): SlippiState => produce(state, draft => {
            draft.port = payload;
        }),
        updateSettings: (state: SlippiState, payload: string): SlippiState => produce(state, draft => {
            draft.settings = payload;
        }),
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
