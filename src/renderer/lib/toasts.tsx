import React from "react";

import { NoDolphinToast } from "@/components/toasts/NoDolphinToast";
import { toast } from "react-toastify";

export const toastNoDolphin = () => {
    toast.error(<NoDolphinToast />, {
        autoClose: false,
        toastId: "no-dolphin-toast",
    });
};
