import { ipcRenderer } from "electron";

import { IPC } from "common/ipc";

export type IPCResponse<T> = [T, Error];

export const ipc = new IPC(ipcRenderer, () => ipcRenderer);
