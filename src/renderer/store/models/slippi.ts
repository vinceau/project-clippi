import { createModel } from "@rematch/core";

import produce from "immer";
import { EventActionConfig } from "@/components/Automator/Automator";
import { updateEventActionManager } from "@/lib/actions";
import { ActionEvent } from "@/lib/realtime";

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
        updateEvents: (state: SlippiState, payload: EventActionConfig[]): SlippiState => {
            const newState = produce(state, draft => {
                draft.events = payload;
            });
            updateEventActionManager(newState.events);
            return newState;
        },
        addNewEventAction: (state: SlippiState, payload: ActionEvent): SlippiState => {
            const newState = produce(state, draft => {
                draft.events.push({
                    event: payload,
                    actions: [],
                });
            });
            updateEventActionManager(newState.events);
            return newState;
        },
        updateActionEvent: (state: SlippiState, payload: { index: number; event: EventActionConfig }): SlippiState => {
            const newState = produce(state, draft => {
                draft.events[payload.index] = payload.event;
            });
            updateEventActionManager(newState.events);
            return newState;
        },
        removeActionEvent: (state: SlippiState, payload: number): SlippiState => {
            const newState = produce(state, draft => {
                draft.events.splice(payload, 1);
            });
            updateEventActionManager(newState.events);
            return newState;
        },
    },
});
