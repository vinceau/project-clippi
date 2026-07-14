import { IPC } from "common/ipc";
import { Message } from "common/types";
import type { App, BrowserWindow } from "electron";
import { ipcMain, shell } from "electron";
import { getCurrentTheme } from "./lib/toggleTheme";

export const reset = "\x1b[0m";
export const dim = "\x1b[2m";
export const highlight = "\x1b[36m";

export const setupIPC = (app: App, window: BrowserWindow): IPC => {
  // ipc communication
  ipcMain.on("quit", () => {
    app.quit();
  });

  ipcMain.on("getThemeSync", (event) => {
    event.returnValue = getCurrentTheme();
  });

  const ipc = new IPC(ipcMain, () => window.webContents);

  ipc.on(Message.TrashItem, async ({ path }) => {
    await shell.trashItem(path);
  });

  return ipc;
};
