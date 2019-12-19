import { App, BrowserWindow } from "electron";

import { IPC } from "common/ipc";
import { Message } from "common/types";
import { authenticateTwitch } from "./lib/twitch";
import { showNotification, twitchClipNotification } from "./lib/notifications";

export const setupListeners = (app: App, win: BrowserWindow, ipc: IPC) => {

    ipc.on(Message.AuthenticateTwitch, async (value, _error?: Error) => {
        if (_error) {
            throw new Error("Should not have received error");
        }

        const {
            scopes,
        } = value;

        const token = await authenticateTwitch(scopes);
        return token;
    });

    ipc.on(Message.NotifyTwitchClip, (value, _error?: Error) => {
        if (_error) {
            throw new Error("Should not have received error");
        }

        const { clipId } = value;
        twitchClipNotification(clipId);
    });

    ipc.on(Message.Notify, (value, _error?: Error) => {
        if (_error) {
            throw new Error("Should not have received error");
        }

        const { title, notification } = value;
        showNotification(title, notification);
    });
};
