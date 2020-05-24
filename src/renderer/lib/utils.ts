import * as path from "path";
import * as url from "url";

import { shell } from "electron";
import { DolphinRecorderOptions, openComboInDolphin } from "@/lib/dolphin";
import { Message } from "common/types";
import { remote } from "electron";
import fs from "fs-extra";
import { ipc } from "./rendererIpc";

import { DolphinQueueFormat } from "@vinceau/slp-realtime";
import { isDevelopment } from "common/utils";

const folderOptions = {
    properties: ["openDirectory"],
    filters: [ { name: "All Files", extensions: ["*"] } ],
};

const fileOptions = {
    properties: ["openFile"],
};

export const getFolderPath = async (options?: any): Promise<string | null> => {
    const dialogOptions = options ? options : folderOptions;
    const paths = await getFilePath(dialogOptions);
    if (paths && paths.length > 0) {
        return paths[0];
    }
    return null;
};

export const getFilePath = async (options?: any, save?: boolean): Promise<string[] | null> => {
    const dialogOptions = options ? options : fileOptions;
    try {
        const p = await ipc.sendSyncWithTimeout(
            Message.SelectDirectory,
            0, // timeout
            {
                options: dialogOptions,
                save,
            },
        );
        return p;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const notify = (message: string, title?: string) => {
    ipc.sendMessage(
        Message.Notify,
        {
            message,
            title,
        },
    );
};

// see https://github.com/electron-userland/electron-webpack/issues/99#issuecomment-459251702
export const getStatic = (val: string): string => {
    if (isDevelopment) {
        return url.resolve(window.location.origin, val);
    }
    const appPath = remote.app.getAppPath();
    const imagePath = path.join(appPath, "../static");
    return path.resolve(path.join(imagePath, val));
};

export const loadFileInDolphin = async (options?: Partial<DolphinRecorderOptions>): Promise<void> => {
    const p = await getFilePath({
        filters: [{ name: "JSON files", extensions: ["json"] }],
    });
    if (p && p.length > 0) {
        openComboInDolphin(p[0], options);
    }
};

export const loadDolphinQueue = async (): Promise<DolphinQueueFormat | null> => {
    const p = await getFilePath({
        filters: [{ name: "JSON files", extensions: ["json"] }],
    });
    if (p && p.length > 0) {
        return fs.readJson(p[0]);
    }
    return null;
};

/**
 * Open the specified file in the system file explorer.
 * If the file doesn't exist, open the parent directory.
 * If the parent directory doesn't exist, try the parent's parent directory etc.
 */
export const openFileOrParentFolder = (fileName: string) => {
    let opened = shell.showItemInFolder(fileName);
    let parentFolder = fileName;
    while (!opened) {
        parentFolder = path.dirname(parentFolder);
        opened = shell.openItem(parentFolder);
    }
};
