import { IPC } from "common/ipc";
import type { App, BrowserWindow } from "electron";
import { ipcMain } from "electron";

export const reset = "\x1b[0m";
export const dim = "\x1b[2m";
export const highlight = "\x1b[36m";

export const setupIPC = (app: App, window: BrowserWindow): IPC => {
  // ipc communication
  ipcMain.on("quit", () => {
    app.quit();
  });

  return new IPC(ipcMain, () => window.webContents);
};
