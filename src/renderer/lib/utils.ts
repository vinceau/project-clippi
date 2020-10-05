import * as path from "path";
import * as url from "url";

import fs from "fs-extra";

import { remote, shell } from "electron";

import { Message } from "common/types";
import { ipc } from "./rendererIpc";

import { DolphinQueueFormat } from "@vinceau/slp-realtime";
import { isDevelopment } from "common/utils";

const folderOptions = {
  properties: ["openDirectory"],
  filters: [{ name: "All Files", extensions: ["*"] }],
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
      }
    );
    return p;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const notify = (message: string, title?: string) => {
  ipc.sendMessage(Message.Notify, {
    message,
    title,
  });
};

export const installUpdateAndRestart = () => {
  ipc.sendMessage(Message.InstallUpdateAndRestart);
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
 * Open the specified file or folder in the system file explorer.
 * If it's a file, open the containing folder.
 * If it's a folder, open it.
 * If the file doesn't exist, open the parent directory.
 * If the parent directory doesn't exist, try the parent's parent directory etc.
 */
export const openFileOrParentFolder = (filename: string): void => {
  let opened = false;
  try {
    const stats = fs.statSync(filename);
    if (stats.isFile()) {
      return shell.showItemInFolder(filename);
    }
    if (stats.isDirectory()) {
      opened = shell.openItem(filename);
    }
  } catch (err) {
    // Getting the stats failed so the file probably doesn't exist
    // Instead, we'll just try to open the parent folder
  }

  let parentFolder = filename;
  while (!opened) {
    parentFolder = path.dirname(parentFolder);
    opened = shell.openItem(parentFolder);
  }
};

export const openUrl = (url: string) => {
  shell.openExternal(url);
};
