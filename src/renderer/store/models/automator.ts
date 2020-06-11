import produce from "immer";

import { createModel } from "@rematch/core";

import { EventConfig } from "@vinceau/slp-realtime";

export interface AutomatorState {
  events: EventConfig[];
}

const initialState: AutomatorState = {
  events: [],
};

export const automator = createModel({
  state: initialState,
  reducers: {
    addEvent: (state: AutomatorState, payload: EventConfig): AutomatorState =>
      produce(state, (draft) => {
        draft.events.push(payload);
      }),
    updateEvent: (state: AutomatorState, payload: { index: number; event: EventConfig }): AutomatorState =>
      produce(state, (draft) => {
        draft.events[payload.index] = payload.event;
      }),
    removeEvent: (state: AutomatorState, payload: number): AutomatorState =>
      produce(state, (draft) => {
        draft.events.splice(payload, 1);
      }),
  },
});
