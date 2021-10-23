import { IPC } from "common/ipc";
import type { VersionUpdatePayload } from "common/types";
import { Message, UpdateStatus } from "common/types";
import { ipcRenderer } from "electron";

import { dispatcher } from "@/store";

import { toastDownloadComplete, toastNewUpdateAvailable } from "./toasts";

export type IPCResponse<T> = [T, Error];

export const ipc = new IPC(ipcRenderer, () => ipcRenderer);

ipcRenderer.on(Message.VersionUpdateStatus, (_, payload: VersionUpdatePayload) => {
  dispatcher.tempContainer.setUpdateStatus(payload);

  switch (payload.status) {
    case UpdateStatus.UPDATE_AVAILABLE: {
      const { version } = payload.payload;
      toastNewUpdateAvailable(version);
      break;
    }
    case UpdateStatus.DOWNLOAD_COMPLETE: {
      toastDownloadComplete();
      break;
    }
  }
});
