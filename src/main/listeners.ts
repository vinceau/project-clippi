import { IPC } from "common/ipc";
import { Message } from "common/types";

import { openFileSystemDialog } from "./lib/fileSystem";
import { showNotification } from "./lib/notifications";
import { twitchController } from "./lib/twitch";

export const setupListeners = (ipc: IPC) => {

    ipc.on(Message.AuthenticateTwitch, async (value, _error?: Error) => {
        if (_error) {
            throw new Error("Should not have received error");
        }

        const {
            scopes,
        } = value;

        try {
            const user = await twitchController.authenticate(scopes);
            if (!user) {
                return null;
            }
            return {
                displayName: user.displayName,
                profilePictureUrl: user.profilePictureUrl,
                name: user.name,
            };
        } catch (err) {
            console.error(err);
            showNotification("Error authenticating with Twitch");
            return null;
        }
    });

    ipc.on(Message.CreateTwitchClip, async (value, _error?: Error) => {
        if (_error) {
            throw new Error("Should not have received error");
        }

        const {
            channel,
        } = value;

        try {
            const clipId = await twitchController.clip(channel);
            console.log(`Created a clip: ${clipId}`);
            return clipId;
        } catch (err) {
            console.error(err);
            showNotification("Error creating Twitch clip");
            return null;
        }
    });

    ipc.on(Message.SignOutTwitch, async (_, _error?: Error) => {
        if (_error) {
            throw new Error("Should not have received error");
        }

        try {
            await twitchController.signOut();
        } catch (err) {
            console.error(err);
            showNotification("Error signing out of Twitch");
            return err;
        }
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
