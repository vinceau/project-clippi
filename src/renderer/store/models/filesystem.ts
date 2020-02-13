import * as path from "path";

import { createModel } from "@rematch/core";
import { remote } from "electron";
import produce from "immer";

import { FindComboOption } from "@/lib/fileProcessor";
import { SoundMap } from "@/lib/sounds";
import { getFilePath } from "@/lib/utils";

const homeDirectory = remote.app.getPath("home");

export interface FileSystemState {
    filesPath: string;
    liveSlpFilesPath: string;
    combosFilePath: string;
    includeSubFolders: boolean;
    deleteFilesWithNoCombos: boolean;
    findCombos: boolean;
    findComboOption: FindComboOption;
    renameFiles: boolean;
    renameFormat: string;
    openCombosWhenDone: boolean;
    soundFiles: SoundMap;
}

export const fileSystemInitialState: FileSystemState = {
    filesPath: homeDirectory,
    liveSlpFilesPath: "",
    combosFilePath: path.join(homeDirectory, "combos.json"),
    includeSubFolders: false,
    deleteFilesWithNoCombos: false,
    findCombos: true,
    findComboOption: FindComboOption.OnlyCombos,
    renameFiles: false,
    renameFormat: "{{YY}}{{MM}}{{DD}}_{{HH}}{{mm}}_{{playerShortChar}}_v_{{opponentShortChar}}_({{shortStage}}).slp",
    openCombosWhenDone: false,
    soundFiles: {},
};

export const filesystem = createModel({
    state: fileSystemInitialState,
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
        setFindComboOption: (state: FileSystemState, payload: FindComboOption): FileSystemState => produce(state, draft => {
            draft.findComboOption = payload;
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
        setFindCombos: (state: FileSystemState, payload: boolean): FileSystemState => produce(state, draft => {
            draft.findCombos = payload;
        }),
        setRenameFiles: (state: FileSystemState, payload: boolean): FileSystemState => produce(state, draft => {
            draft.renameFiles = payload;
        }),
        setRenameFormat: (state: FileSystemState, payload: string): FileSystemState => produce(state, draft => {
            draft.renameFormat = payload;
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
    }),
});
