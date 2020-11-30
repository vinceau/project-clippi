import React from "react";

import { NoDolphinToast } from "@/components/toasts/NoDolphinToast";
import { ProcessingError } from "@/components/toasts/ProcessingError";
import { toast } from "react-toastify";
import { UpdateAvailable } from "@/components/toasts/UpdateAvailable";
import { DownloadComplete } from "@/components/toasts/DownloadComplete";

export const toastNoDolphin = (): void => {
  toast.error(<NoDolphinToast />, {
    autoClose: false,
    toastId: "no-dolphin-toast",
  });
};

export const toastProcessingError = (errorMessage: string): void => {
  toast.error(<ProcessingError errorMessage={errorMessage} />, {
    autoClose: false,
    toastId: "processing-error-toast",
    closeOnClick: false,
  });
};

export const toastDownloadComplete = (): void => {
  toast.info(<DownloadComplete />, {
    autoClose: false,
    toastId: "update-download-complete",
    closeOnClick: false,
  });
};

export const toastNewUpdateAvailable = (version: string): void => {
  const toastId = "new-update-available";
  toast.info(<UpdateAvailable version={version} dismiss={() => toast.dismiss(toastId)} />, {
    autoClose: false,
    toastId,
    closeOnClick: false,
  });
};
