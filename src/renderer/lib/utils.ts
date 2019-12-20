import * as path from "path";
import * as url from 'url'

import { Message } from "common/types";
import { ipc } from "./rendererIpc";

export const delay = async (ms: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, ms));
};

export const notify = (title: string, body: string) => {
    ipc.sendMessage(
        Message.Notify,
        {
            title,
            notification: body,
        },
    );
};

declare const __static: string;

const isDevelopment = process.env.NODE_ENV !== "production";

// see https://github.com/electron-userland/electron-webpack/issues/99#issuecomment-459251702
export const getStatic = (val: string): string => {
    if (isDevelopment) {
        return url.resolve("/", val);
    }
    return path.resolve(__static, val);
};
