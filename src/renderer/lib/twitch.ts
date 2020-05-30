import { Message, TwitchClip, TwitchUser } from "common/types";
import { ipc } from "./rendererIpc";

export const authenticateTwitch = async (scopes: string[]): Promise<TwitchUser | null> => {
  return await ipc.sendSyncWithTimeout(
    Message.AuthenticateTwitch,
    0, // timeout
    { scopes }
  );
};

export const createTwitchClip = async (channel?: string, postToChat?: boolean): Promise<TwitchClip> => {
  const clip = await ipc.sendSyncWithTimeout(
    Message.CreateTwitchClip,
    0, // timeout
    { channel, postToChat }
  );
  if (!clip) {
    throw new Error("Failed to create Twitch clip");
  }
  return {
    ...clip,
    timestamp: new Date(clip.timestamp), // Rehydrate the timestamp
  };
};

export const signOutTwitch = async (): Promise<void> => {
  await ipc.sendSyncWithTimeout(
    Message.SignOutTwitch,
    0 // timeout
  );
};
