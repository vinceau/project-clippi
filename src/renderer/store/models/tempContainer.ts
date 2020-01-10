import { createModel } from "@rematch/core";
import produce from "immer";

import { ConnectionStatus } from "@vinceau/slp-realtime";
import { currentUser } from "common/twitch";
import { Scene } from "obs-websocket-js";
import { HelixUser } from "twitch";

export interface TempContainerState {
    slippiConnectionStatus: ConnectionStatus;
    twitchUser: HelixUser | null;
    showSettings: boolean;
    currentSlpFolderStream: string;
    comboFinderPercent: number;
    comboFinderLog: string;
    comboFinderProcessing: boolean;
    obsConnected: boolean;
    obsScenes: Scene[];
}

const initialState: TempContainerState = {
    slippiConnectionStatus: ConnectionStatus.DISCONNECTED,
    twitchUser: null,
    showSettings: false,
    currentSlpFolderStream: "",
    comboFinderPercent: 0,
    comboFinderLog: "",
    comboFinderProcessing: false,
    obsConnected: false,
    obsScenes: [],
};

export const tempContainer = createModel({
    state: initialState,
    reducers: {
        setOBSSceneItems: (state: TempContainerState, payload: Scene[]): TempContainerState =>  produce(state, draft => {
            draft.obsScenes = payload;
        }),
        setOBSConnected: (state: TempContainerState, payload: boolean): TempContainerState => produce(state, draft => {
            draft.obsConnected = payload;
        }),
        setSlippiConnectionStatus: (state: TempContainerState, payload: ConnectionStatus): TempContainerState => produce(state, draft => {
            draft.slippiConnectionStatus = payload;
        }),
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
        setSlpFolderStream: (state: TempContainerState, payload: string): TempContainerState => produce(state, draft => {
            draft.currentSlpFolderStream = payload;
        }),
        clearSlpFolderStream: (state: TempContainerState): TempContainerState => produce(state, draft => {
            draft.currentSlpFolderStream = "";
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
