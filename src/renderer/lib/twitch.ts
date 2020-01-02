import { Message } from "common/types";
import { ipc } from "./rendererIpc";

export const fetchTwitchAuthToken = async (scopes: string | string[]): Promise<string> => {
    const token = await ipc.sendSyncWithTimeout(
        Message.AuthenticateTwitch,
        0, // timeout
        { scopes }
    );
    return token;
};
