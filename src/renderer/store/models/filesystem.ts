import * as path from "path";

import { createModel } from "@rematch/core";
import produce from "immer";

import { SoundMap } from "@/lib/sounds";
import { getFilePath, getFolderPath } from "@/lib/utils";
import { remote } from "electron";

const homeDirectory = remote.app.getPath("home");

export interface FileSystemState {
    filesPath: string;
    liveSlpFilesPath: string;
    combosFilePath: string;
    includeSubFolders: boolean;
    deleteFilesWithNoCombos: boolean;
    openCombosWhenDone: boolean;
    soundFiles: SoundMap;
}

const initialState: FileSystemState = {
    filesPath: homeDirectory,
    liveSlpFilesPath: "",
    combosFilePath: path.join(homeDirectory, "combos.json"),
    includeSubFolders: false,
    deleteFilesWithNoCombos: false,
    openCombosWhenDone: false,
    soundFiles: {},
};

export const filesystem = createModel({
    state: initialState,
    reducers: {
        setSound: (state: FileSystemState, payload: { name: string, filePath: string}): FileSystemState => {
            const newState = produce(state.soundFiles, draft => {
                draft[payload.name] = payload.filePath;
            });
            return produce(state, draft => {
                draft.soundFiles = newState;
            });
        },
        removeSound: (state: FileSystemState, payload: string): FileSystemState => {
            const newState = produce(state.soundFiles, draft => {
                delete draft[payload];
            });
            return produce(state, draft => {
                draft.soundFiles = newState;
            });
        },
        setLiveSlpFilesPath: (state: FileSystemState, payload: string): FileSystemState => produce(state, draft => {
            draft.liveSlpFilesPath = payload;
        }),
        setFilesPath: (state: FileSystemState, payload: string): FileSystemState => produce(state, draft => {
            draft.filesPath = payload;
        }),
        setCombosFilePath: (state: FileSystemState, payload: string): FileSystemState => produce(state, draft => {
            draft.combosFilePath = payload;
        }),
        setIncludeSubFolders: (state: FileSystemState, payload: boolean): FileSystemState => produce(state, draft => {
            draft.includeSubFolders = payload;
        }),
        setFileDeletion: (state: FileSystemState, payload: boolean): FileSystemState => produce(state, draft => {
            draft.deleteFilesWithNoCombos = payload;
        }),
        setOpenCombosWhenDone: (state: FileSystemState, payload: boolean): FileSystemState => produce(state, draft => {
            draft.openCombosWhenDone = payload;
        }),
    },
    effects: dispatch => ({
        async addSound() {
            const p = await getFilePath({
                filters: [{ name: "Audio files", extensions: ["flac", "mp3", "m4a", "webm", "wav", "aac", "ogg", "opus"] }],
            }, false);
            if (p) {
                const name = path.basename(p);
                dispatch.filesystem.setSound({
                    name,
                    filePath: p,
                });
            }
        },
        async getLiveSlpFilesPath() {
            const p = await getFolderPath();
            if (p) {
                dispatch.filesystem.setLiveSlpFilesPath(p);
            }
        },
        async getFilesPath() {
            const p = await getFolderPath();
            if (p) {
                dispatch.filesystem.setFilesPath(p);
            }
        },
        async getCombosFilePath() {
            const p = await getFilePath({
                filters: [{ name: "JSON files", extensions: ["json"] }],
            }, true);
            if (p) {
                dispatch.filesystem.setCombosFilePath(p);
            }
        },
    }),
});
