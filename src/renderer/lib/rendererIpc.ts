import { dispatcher } from "@/store";
import { ipcRenderer } from "electron";

import { IPC } from "common/ipc";
import { Message, UpdateStatus, VersionUpdatePayload } from "common/types";
import { toastDownloadComplete, toastNewUpdateAvailable } from "./toasts";

export type IPCResponse<T> = [T, Error];

export const ipc = new IPC(ipcRenderer, () => ipcRenderer);

export async function getStoreValue(key: string): Promise<any> {
  const val = await ipcRenderer.invoke("getStoreValue", key);
  return val;
}

// Automatically update the latest version into store
ipcRenderer.on(Message.VersionUpdateStatus, (_, payload: VersionUpdatePayload) => {
  dispatcher.tempContainer.setUpdateStatus(payload);

  switch (payload.status) {
    case UpdateStatus.UPDATE_AVAILABLE: {
      dispatcher.appContainer.setLatestVersion(payload.payload);
      toastNewUpdateAvailable(payload.payload);
      break;
    }
    case UpdateStatus.NO_UPDATE: {
      dispatcher.appContainer.setLatestVersion(payload.payload);
      break;
    }
  }
});
