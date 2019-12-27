import * as path from "path";

import { createModel } from "@rematch/core";
import produce from "immer";

import { getFilePath, getFolderPath } from "@/lib/utils";
import { remote } from "electron";

const homeDirectory = remote.app.getPath("home");

export interface FileSystemState {
    filesPath: string;
    combosFilePath: string;
    includeSubFolders: boolean;
}

const initialState: FileSystemState = {
    filesPath: homeDirectory,
    combosFilePath: path.join(homeDirectory, "combos.json"),
    includeSubFolders: false,
};

export const filesystem = createModel({
    state: initialState,
    reducers: {
        setFilesPath: (state: FileSystemState, payload: string): FileSystemState => produce(state, draft => {
            draft.filesPath = payload;
        }),
        setCombosFilePath: (state: FileSystemState, payload: string): FileSystemState => produce(state, draft => {
            draft.combosFilePath = payload;
        }),
        setIncludeSubFolders: (state: FileSystemState, payload: boolean): FileSystemState => produce(state, draft => {
            draft.includeSubFolders = payload;
        }),
    },
    effects: dispatch => ({
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
