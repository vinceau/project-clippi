import { createModel } from "@rematch/core";
import produce from "immer";

import { Scene } from "obs-websocket-js";

import { ConnectionStatus } from "@vinceau/slp-realtime";
import { currentUser } from "common/twitch";
import { HelixUser } from "twitch";
import { OBSConnectionStatus, OBSRecordingStatus } from "@/lib/obs";

export interface TempContainerState {
    slippiConnectionStatus: ConnectionStatus;
    obsConnectionStatus: OBSConnectionStatus;
    obsRecordingStatus: OBSRecordingStatus;
    obsScenes: Scene[];
    twitchUser: HelixUser | null;
    showSettings: boolean;
    currentSlpFolderStream: string;
    comboFinderPercent: number;
    comboFinderLog: string;
    comboFinderProcessing: boolean;
    latestPath: { [page: string]: string };
}

const initialState: TempContainerState = {
    slippiConnectionStatus: ConnectionStatus.DISCONNECTED,
    obsConnectionStatus: OBSConnectionStatus.DISCONNECTED,
    obsRecordingStatus: OBSRecordingStatus.RECORDING,
    obsScenes: [],
    twitchUser: null,
    showSettings: false,
    currentSlpFolderStream: "",
    comboFinderPercent: 0,
    comboFinderLog: "",
    comboFinderProcessing: false,
    latestPath: {
        main: "/main/automator",
        settings: "/settings/combo-settings",
    },
};

export const tempContainer = createModel({
    state: initialState,
    reducers: {
        setSlippiConnectionStatus: (state: TempContainerState, payload: ConnectionStatus): TempContainerState => produce(state, draft => {
            draft.slippiConnectionStatus = payload;
        }),
        setOBSConnectionStatus: (state: TempContainerState, payload: OBSConnectionStatus): TempContainerState => produce(state, draft => {
            draft.obsConnectionStatus = payload;
        }),
        setOBSRecordingStatus: (state: TempContainerState, payload: OBSRecordingStatus): TempContainerState => produce(state, draft => {
            draft.obsRecordingStatus = payload;
        }),
        setOBSScenes: (state: TempContainerState, payload: Scene[]): TempContainerState => produce(state, draft => {
            draft.obsScenes = payload;
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
        setLatestPath: (state: TempContainerState, payload: { page: string, pathname: string }): TempContainerState => {
            const newState = produce(state.latestPath, draft => {
                draft[payload.page] = payload.pathname;
            });
            return produce(state, draft => {
                draft.latestPath = newState;
            });
        },
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
