import { IPC } from "common/ipc";
import { Message } from "common/types";

import { openFileSystemDialog } from "./lib/fileSystem";
import { showNotification } from "./lib/notifications";
import { authenticateTwitch, clearAllTwitchCookies } from "./lib/twitch";

export const setupListeners = (ipc: IPC) => {

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

    ipc.on(Message.SignOutTwitch, async (_, _error?: Error) => {
        if (_error) {
            throw new Error("Should not have received error");
        }

        await clearAllTwitchCookies();
    });

    ipc.on(Message.SelectDirectory, async (value, _error?: Error) => {
        if (_error) {
            throw new Error("Should not have received error");
        }

        const { options, save } = value;

        return await openFileSystemDialog(options, save);
    });

    ipc.on(Message.Notify, (value, _error?: Error) => {
        if (_error) {
            throw new Error("Should not have received error");
        }

        const { title, message } = value;
        showNotification(message, title);
    });
};
