import { dispatcher } from "@/store";
import { ipcRenderer } from "electron";

import { IPC } from "common/ipc";
import { Message, UpdateStatus, VersionUpdatePayload } from "common/types";
import { toastDownloadComplete, toastNewUpdateAvailable } from "./toasts";

export type IPCResponse<T> = [T, Error];

export const ipc = new IPC(ipcRenderer, () => ipcRenderer);

ipcRenderer.on(Message.VersionUpdateStatus, (_, payload: VersionUpdatePayload) => {
  dispatcher.tempContainer.setUpdateStatus(payload);

  switch (payload.status) {
    case UpdateStatus.UPDATE_AVAILABLE: {
      toastNewUpdateAvailable(payload.payload);
      break;
    }
    case UpdateStatus.DOWNLOAD_COMPLETE: {
      toastDownloadComplete();
      break;
    }
  }
});
