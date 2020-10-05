import React from "react";

import { NoDolphinToast } from "@/components/toasts/NoDolphinToast";
import { ProcessingError } from "@/components/toasts/ProcessingError";
import { toast } from "react-toastify";

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

export const toastDownloadComplete = (version: string): void => {
  toast.error(<div>Update to version {version} available. Restart?</div>, {
    autoClose: false,
    toastId: "update-download-complete",
    closeOnClick: false,
  });
};

export const toastNewUpdateAvailable = (version: string): void => {
  toast.error(<div>New update to v{version} is available!</div>, {
    autoClose: false,
    toastId: "new-update-available",
    closeOnClick: false,
  });
};
