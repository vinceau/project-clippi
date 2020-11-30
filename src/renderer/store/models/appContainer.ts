import produce from "immer";

import { createModel } from "@rematch/core";

export interface AppContainerState {
  showDevOptions: boolean;
  autoNameRecordedFiles: boolean;
}

const initialState: AppContainerState = {
  showDevOptions: false,
  autoNameRecordedFiles: false,
};

export const appContainer = createModel({
  state: initialState,
  reducers: {
    setShowDevOptions: (state: AppContainerState, payload: boolean): AppContainerState => {
      return produce(state, (draft) => {
        draft.showDevOptions = payload;
      });
    },
    setAutoNameRecordedFiles: (state: AppContainerState, payload: boolean): AppContainerState => {
      return produce(state, (draft) => {
        draft.autoNameRecordedFiles = payload;
      });
    },
  },
});
