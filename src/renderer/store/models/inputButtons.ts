import { createModel } from "@rematch/core";
import produce from "immer";

export interface InputButtonState {
  inputButtonCombo: string[];
  inputButtonPreInputFrames: number;
  inputButtonPostInputFrames: number;
  inputButtonHoldAmount: number;
  inputButtonHoldUnits: string;
  inputButtonLockoutSecs: number;
  inputButtonHold: boolean;
}

export const inputButtonInitialState: InputButtonState = {
  inputButtonCombo: [],
  inputButtonPreInputFrames: 1500, // 25 seconds
  inputButtonPostInputFrames: 300, // 5 seconds
  inputButtonHoldAmount: 2,
  inputButtonHoldUnits: "seconds",
  inputButtonLockoutSecs: 5,
  inputButtonHold: false,
};

export const inputButtons = createModel({
  state: inputButtonInitialState,
  reducers: {
    setInputButtonCombo: (state: InputButtonState, payload: string[]): InputButtonState =>
      produce(state, (draft) => {
        draft.inputButtonCombo = payload;
      }),
    setInputButtonPreInputFrames: (state: InputButtonState, payload: number): InputButtonState =>
      produce(state, (draft) => {
        // Make sure we take the integer value for frames
        draft.inputButtonPreInputFrames = Math.floor(payload);
      }),
    setInputButtonPostInputFrames: (state: InputButtonState, payload: number): InputButtonState =>
      produce(state, (draft) => {
        // Make sure we take the integer value for frames
        draft.inputButtonPostInputFrames = Math.floor(payload);
      }),
    setInputButtonHoldAmount: (state: InputButtonState, payload: number): InputButtonState =>
      produce(state, (draft) => {
        draft.inputButtonHoldAmount = payload;
      }),
    setInputButtonHoldUnits: (state: InputButtonState, payload: string): InputButtonState =>
      produce(state, (draft) => {
        draft.inputButtonHoldUnits = payload;
      }),
    setInputButtonLockoutSecs: (state: InputButtonState, payload: number): InputButtonState =>
      produce(state, (draft) => {
        draft.inputButtonLockoutSecs = payload;
      }),
    setInputButtonHold: (state: InputButtonState, payload: boolean): InputButtonState =>
      produce(state, (draft) => {
        draft.inputButtonHold = payload;
      }),
  },
});
