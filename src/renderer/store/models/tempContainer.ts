import { createModel } from "@rematch/core";
import produce from "immer";

import { currentUser } from "common/twitch";
import { HelixUser } from "twitch";

export interface TempContainerState {
    twitchUser: HelixUser | null;
    showSettings: boolean;
    comboFinderPercent: number;
    comboFinderLog: string;
    comboFinderProcessing: boolean;
}

const initialState: TempContainerState = {
    twitchUser: null,
    showSettings: false,
    comboFinderPercent: 0,
    comboFinderLog: "",
    comboFinderProcessing: false,
};

export const tempContainer = createModel({
    state: initialState,
    reducers: {
        setTwitchUser: (state: TempContainerState, payload: HelixUser): TempContainerState => produce(state, draft => {
            draft.twitchUser = payload;
        }),
        toggleSettings: (state: TempContainerState): TempContainerState => produce(state, draft => {
            draft.showSettings = !state.showSettings;
        }),
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
    effects: dispatch => ({
        async updateUser(token: string) {
            const user = await currentUser(token);
            if (!user) {
                console.error(`Could not get user using token: ${token}`);
                return;
            }
            dispatch.tempContainer.setTwitchUser(user);
        },
    }),
});
