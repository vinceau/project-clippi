import { createModel } from "@rematch/core";
import produce from "immer";

import { getFolderPath } from "@/lib/utils";

export interface FileSystemState {
    filesPath: string;
    includeSubFolders: boolean;
}

const initialState: FileSystemState = {
    filesPath: ".",
    includeSubFolders: false,
};

export const filesystem = createModel({
    state: initialState,
    reducers: {
        setFilesPath: (state: FileSystemState, payload: string): FileSystemState => produce(state, draft => {
            draft.filesPath = payload;
        }),
        setIncludeSubFolders: (state: FileSystemState, payload: boolean): FileSystemState => produce(state, draft => {
            draft.includeSubFolders = payload;
        }),
    },
    effects: dispatch => ({
        async getFilesPath() {
            const path = await getFolderPath();
            if (path) {
                dispatch.filesystem.setFilesPath(path);
            }
        },
    }),
});
