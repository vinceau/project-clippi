import { TwitchAccessToken, Message } from "common/types";
import { ipc } from "./rendererIpc";

export const fetchTwitchAuthToken = async (scopes: string | string[]): Promise<TwitchAccessToken | null> => {
    const token = await ipc.sendSyncWithTimeout(
        Message.AuthenticateTwitch,
        0, // timeout
        { scopes }
    );
    return token;
};

export const signOutTwitch = async (): Promise<void> => {
    await ipc.sendSyncWithTimeout(
        Message.SignOutTwitch,
        0, // timeout
    );
};
