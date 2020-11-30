import produce from "immer";

import { createModel } from "@rematch/core";

export interface AppContainerState {
  showDevOptions: boolean;
}

const initialState: AppContainerState = {
  showDevOptions: false,
};

export const appContainer = createModel({
  state: initialState,
  reducers: {
    setShowDevOptions: (state: AppContainerState, payload: boolean): AppContainerState => {
      return produce(state, (draft) => {
        draft.showDevOptions = payload;
      });
    },
  },
});
