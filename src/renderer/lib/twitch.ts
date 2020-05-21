import { Message, TwitchUser } from "common/types";
import { ipc } from "./rendererIpc";

export const authenticateTwitch = async (scopes: string[]): Promise<TwitchUser | null> => {
    return await ipc.sendSyncWithTimeout(
        Message.AuthenticateTwitch,
        0, // timeout
        { scopes }
    );
};

export const createTwitchClip = async (channel?: string): Promise<string> => {
    const clipId = await ipc.sendSyncWithTimeout(
        Message.CreateTwitchClip,
        0, // timeout
        { channel }
    );
    if (!clipId) {
        throw new Error("Failed to create Twitch clip");
    }
    return clipId;
};

export const signOutTwitch = async (): Promise<void> => {
    await ipc.sendSyncWithTimeout(
        Message.SignOutTwitch,
        0, // timeout
    );
};
