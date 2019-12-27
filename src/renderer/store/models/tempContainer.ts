import { createModel } from "@rematch/core";
import produce from "immer";

export interface TempContainerState {
    comboFinderPercent: number;
    comboFinderLog: string;
    comboFinderProcessing: boolean;
}

const initialState: TempContainerState = {
    comboFinderPercent: 0,
    comboFinderLog: "",
    comboFinderProcessing: false,
};

export const tempContainer = createModel({
    state: initialState,
    reducers: {
        setPercent: (state: TempContainerState, payload: number): TempContainerState => produce(state, draft => {
            // Make sure the payload is between 0 and 100
            const percent = payload < 0 ? 0 : payload > 100 ? 100 : payload;
            draft.comboFinderPercent = percent;
        }),
        setComboLog: (state: TempContainerState, payload: string): TempContainerState => produce(state, draft => {
            draft.comboFinderLog = payload;
        }),
        setComboFinderProcessing: (state: TempContainerState, payload: boolean): TempContainerState => produce(state, draft => {
            draft.comboFinderProcessing = payload;
        }),
    },
});
