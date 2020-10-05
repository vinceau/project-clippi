import { dispatcher } from "@/store";
import { ipcRenderer } from "electron";

import { IPC } from "common/ipc";
import { Message } from "common/types";

export type IPCResponse<T> = [T, Error];

export const ipc = new IPC(ipcRenderer, () => ipcRenderer);

export async function getStoreValue(key: string): Promise<any> {
  const val = await ipcRenderer.invoke("getStoreValue", key);
  return val;
}

// Automatically update the latest version into store
ipcRenderer.on(Message.SetLatestVersion, (_, version) => {
  dispatcher.appContainer.setLatestVersion(version);
});

ipcRenderer.on(Message.SetUpdateDownloadComplete, (_, isDownloadComplete) => {
  dispatcher.tempContainer.SetUpdateDownloadComplete(isDownloadComplete);
});
