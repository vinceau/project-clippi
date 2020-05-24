import React from "react";

import { toast } from "react-toastify";
import { NoDolphinToast } from "@/components/toasts/NoDolphinToast";

export const toastNoDolphin = () => {
    toast.error(<NoDolphinToast />, {
        autoClose: false,
        toastId: "no-dolphin-toast",
    });
};
