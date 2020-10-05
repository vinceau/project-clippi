import { App, BrowserWindow, ipcMain } from "electron";

import { IPC } from "common/ipc";

import Store from "electron-store";

const store = new Store();

export const reset = "\x1b[0m";
export const dim = "\x1b[2m";
export const highlight = "\x1b[36m";

export const setupIPC = (app: App, window: BrowserWindow): IPC => {
  // ipc communication
  ipcMain.on("quit", () => {
    app.quit();
  });

  // Allow renderer to get the store values
  ipcMain.handle("getStoreValue", (_, key) => {
    return store.get(key);
  });

  return new IPC(ipcMain, () => window.webContents);
};
