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
