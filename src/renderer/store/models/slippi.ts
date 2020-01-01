import { createModel } from "@rematch/core";

import produce from "immer";
import { EventActionConfig } from "@/components/Automator/Automator";
import { updateEventActionManager } from "@/lib/actions";

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
    },
});
