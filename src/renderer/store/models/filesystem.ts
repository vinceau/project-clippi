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
    findComboProfile: string;
    findComboOption: FindComboOption;
    renameFiles: boolean;
    renameFormat: string;
    openCombosWhenDone: boolean;
    soundFiles: SoundMap;
    recordSeparateClips: boolean;
    inputButtonCombo: string[];
    inputButtonPreInputFrames: number;
    inputButtonPostInputFrames: number;
    inputButtonHoldFrames: number;
    inputButtonLockoutMs: number;
    inputButtonHold: boolean;
}

export const fileSystemInitialState: FileSystemState = {
    filesPath: homeDirectory,
    liveSlpFilesPath: "",
    combosFilePath: path.join(homeDirectory, "combos.json"),
    includeSubFolders: false,
    deleteFilesWithNoCombos: false,
    findCombos: true,
    findComboProfile: "default",
    findComboOption: FindComboOption.COMBOS,
    renameFiles: false,
    renameFormat: "{{YY}}{{MM}}{{DD}}_{{HH}}{{mm}}_{{playerShortChar}}_v_{{opponentShortChar}}_({{shortStage}}).slp",
    openCombosWhenDone: false,
    soundFiles: {},
    recordSeparateClips: false,
    inputButtonCombo: [],
    inputButtonPreInputFrames: 1500,  // 25 seconds
    inputButtonPostInputFrames: 300,  // 5 seconds
    inputButtonHoldFrames: 1,
    inputButtonLockoutMs: 5000,
    inputButtonHold: false,
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
        setFindComboProfile: (state: FileSystemState, payload: string): FileSystemState => produce(state, draft => {
            draft.findComboProfile = payload;
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
        setRecordSeparateClips: (state: FileSystemState, payload: boolean): FileSystemState => produce(state, draft => {
            draft.recordSeparateClips = payload;
        }),
        setInputButtonCombo: (state: FileSystemState, payload: string[]): FileSystemState => produce(state, draft => {
            draft.inputButtonCombo = payload;
        }),
        setInputButtonPreInputFrames: (state: FileSystemState, payload: number): FileSystemState => produce(state, draft => {
            // Make sure we take the integer value for frames
            draft.inputButtonPreInputFrames = Math.floor(payload);
        }),
        setInputButtonPostInputFrames: (state: FileSystemState, payload: number): FileSystemState => produce(state, draft => {
            // Make sure we take the integer value for frames
            draft.inputButtonPostInputFrames = Math.floor(payload);
        }),
        setInputButtonHoldFrames: (state: FileSystemState, payload: number): FileSystemState => produce(state, draft => {
            // Make sure we take the integer value for frames
            draft.inputButtonHoldFrames = Math.floor(payload);
        }),
        setInputButtonLockoutMs: (state: FileSystemState, payload: number): FileSystemState => produce(state, draft => {
            draft.inputButtonLockoutMs = payload;
        }),
        setInputButtonHold: (state: FileSystemState, payload: boolean): FileSystemState => produce(state, draft => {
            draft.inputButtonHold = payload;
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
