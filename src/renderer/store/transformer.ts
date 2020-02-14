import fs from "fs-extra";

import { produce } from "immer";
import { createTransform } from "redux-persist";
import { FileSystemState } from "./models/filesystem";

export const transformer = createTransform(
    state => state,
    (state, key) => produce(state, draft => {
        switch (key) {
            case "filesystem":
                const soundFiles = (draft as FileSystemState).soundFiles;
                (draft as FileSystemState).soundFiles = {};
                Object.entries(soundFiles).forEach(([name, value]) => {
                    if (fs.existsSync(value)) {
                        (draft as FileSystemState).soundFiles[name] = value;
                    }
                });
                break;
        }
    }),
);
