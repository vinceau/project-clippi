import * as path from "path";
import * as url from "url";

import { DolphinRecorderOptions, openComboInDolphin } from "@/lib/dolphin";
import { Message } from "common/types";
import { remote, shell } from "electron";
import fs from "fs-extra";
import { ipc } from "./rendererIpc";

import { DolphinQueueFormat } from "@vinceau/slp-realtime";

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

export const framesToMillis = (frames: number): number => {
    return framesToSeconds(frames) * 1000;
};

export const framesToSeconds = (frames: number): number => {
    return frames / 60.0;
};

export const secondsToFrames = (secs: number): number => {
    return secs * 60.0;
};

export const millisToFrames = (ms: number): number => {
    return secondsToFrames(ms / 1000);
};
