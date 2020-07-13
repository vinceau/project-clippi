import produce from "immer";

import { createModel } from "@rematch/core";

import { EventConfig } from "@vinceau/slp-realtime";

export interface NamedEventConfig extends EventConfig {
  name: string;
}

export interface AutomatorState {
  events: NamedEventConfig[];
}

const initialState: AutomatorState = {
  events: [],
};

export const automator = createModel({
  state: initialState,
  reducers: {
    addEvent: (state: AutomatorState, payload: NamedEventConfig): AutomatorState =>
      produce(state, (draft) => {
        draft.events = draft.events.filter((e) => e.id !== payload.id);
        draft.events.push(payload);
      }),
    updateEvent: (
      state: AutomatorState,
      payload: { index: number; event: Omit<NamedEventConfig, "id"> }
    ): AutomatorState =>
      produce(state, (draft) => {
        const id = draft.events[payload.index].id;
        draft.events[payload.index] = { ...payload.event, id };
      }),
    removeEvent: (state: AutomatorState, payload: number): AutomatorState =>
      produce(state, (draft) => {
        draft.events.splice(payload, 1);
      }),
  },
});
