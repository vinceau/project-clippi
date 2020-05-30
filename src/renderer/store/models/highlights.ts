import { createModel } from "@rematch/core";
import produce from "immer";

import { FindComboOption } from "common/fileProcessor";

export const defaultRenameFormat =
  "{{YY}}{{MM}}{{DD}}_{{HH}}{{mm}}_{{playerShortChar}}_v_{{opponentShortChar}}_({{shortStage}}).slp";

export interface HighlightState {
  includeSubFolders: boolean;
  deleteFilesWithNoCombos: boolean;
  findCombos: boolean;
  findComboProfile: string;
  highlightMethod: FindComboOption;
  renameFiles: boolean;
  renameFormat: string;
  openCombosWhenDone: boolean;
}

export const highlightInitialState: HighlightState = {
  includeSubFolders: false,
  deleteFilesWithNoCombos: false,
  findCombos: true,
  findComboProfile: "default",
  highlightMethod: FindComboOption.COMBOS,
  renameFiles: false,
  renameFormat: defaultRenameFormat,
  openCombosWhenDone: false,
};

export const highlights = createModel({
  state: highlightInitialState,
  reducers: {
    setFindComboProfile: (state: HighlightState, payload: string): HighlightState =>
      produce(state, (draft) => {
        draft.findComboProfile = payload;
      }),
    setHighlightMethod: (state: HighlightState, payload: FindComboOption): HighlightState =>
      produce(state, (draft) => {
        draft.highlightMethod = payload;
      }),
    setIncludeSubFolders: (state: HighlightState, payload: boolean): HighlightState =>
      produce(state, (draft) => {
        draft.includeSubFolders = payload;
      }),
    setFileDeletion: (state: HighlightState, payload: boolean): HighlightState =>
      produce(state, (draft) => {
        draft.deleteFilesWithNoCombos = payload;
      }),
    setFindCombos: (state: HighlightState, payload: boolean): HighlightState =>
      produce(state, (draft) => {
        draft.findCombos = payload;
      }),
    setRenameFiles: (state: HighlightState, payload: boolean): HighlightState =>
      produce(state, (draft) => {
        draft.renameFiles = payload;
      }),
    setRenameFormat: (state: HighlightState, payload: string): HighlightState =>
      produce(state, (draft) => {
        draft.renameFormat = payload;
      }),
    setOpenCombosWhenDone: (state: HighlightState, payload: boolean): HighlightState =>
      produce(state, (draft) => {
        draft.openCombosWhenDone = payload;
      }),
  },
});
