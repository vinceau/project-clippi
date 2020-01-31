import * as path from "path";
import * as url from "url";

import cp from "child_process";
import { Message } from "common/types";
import { remote, shell } from "electron";
import { ipc } from "./rendererIpc";

export const delay = async (ms: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, ms));
};

const folderOptions = {
    properties: ["openDirectory"],
};

const fileOptions = {
    properties: ["openFile"],
};

export const getFolderPath = async (options?: any): Promise<string | null> => {
    const dialogOptions = options ? options : folderOptions;
    return getFilePath(dialogOptions);
};

export const getFilePath = async (options?: any, save?: boolean): Promise<string | null> => {
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

export const isDevelopment = process.env.NODE_ENV !== "production";

// see https://github.com/electron-userland/electron-webpack/issues/99#issuecomment-459251702
export const getStatic = (val: string): string => {
    if (isDevelopment) {
        return url.resolve(window.location.origin, val);
    }
    const appPath = remote.app.getAppPath();
    const imagePath = path.join(appPath, "../static");
    return path.resolve(path.join(imagePath, val));
};

export const openComboInDolphin = (comboFilePath: string): void => {
    const appData = remote.app.getPath("appData");
    const dolphinPath = path.join(appData, "Slippi Desktop App", "dolphin", "Dolphin.exe");
    console.log(dolphinPath);
    cp.execFile(dolphinPath, ["-i", comboFilePath]);
};

export const loadFileInDolphin = async (): Promise<void> => {
    const p = await getFilePath({
        filters: [{ name: "JSON files", extensions: ["json"] }],
    });
    if (p) {
        openComboInDolphin(p);
    }
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

export const parseSecondsDelayValue = (defaultSeconds: number, delaySeconds?: string): number => {
    let seconds = parseInt(delaySeconds || defaultSeconds.toString(), 10);
    if (isNaN(seconds)) {
        seconds = defaultSeconds;
    }
    return seconds;
};

export const capitalize = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
};
