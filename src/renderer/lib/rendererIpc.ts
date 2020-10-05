import { dispatcher } from "@/store";
import { ipcRenderer } from "electron";

import { IPC } from "common/ipc";
import { Message } from "common/types";
import { toastDownloadComplete, toastNewUpdateAvailable } from "./toasts";
import { needsUpdate } from "common/checkForUpdates";

export type IPCResponse<T> = [T, Error];

export const ipc = new IPC(ipcRenderer, () => ipcRenderer);

export async function getStoreValue(key: string): Promise<any> {
  const val = await ipcRenderer.invoke("getStoreValue", key);
  return val;
}

// Automatically update the latest version into store
ipcRenderer.on(Message.SetLatestVersion, (_, version) => {
  console.log(`got message from main. latest version: ${version}`);
  dispatcher.appContainer.setLatestVersion(version);
  if (needsUpdate(version)) {
    toastNewUpdateAvailable(version);
  }
});

ipcRenderer.on(Message.SetUpdateDownloadComplete, (_, isDownloadComplete) => {
  console.log(`got message from main. download complete!`);
  dispatcher.tempContainer.SetUpdateDownloadComplete(isDownloadComplete);
  toastDownloadComplete("1.2.3");
});
